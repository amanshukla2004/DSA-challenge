(() => {
  const THEME_KEY = 'dsa_revision_vault_theme';

  const state = {
    data: null,
    tracker: { startDate: null, activeDayOverride: null, todayTargets: [], dailyNotes: {} },
    flatItems: [],
    itemById: new Map(),
    conceptsById: new Map(),
    mode: 'dashboard', // dashboard | roadmap | concepts
    selectedId: null,
    selectedConceptId: null,
    activeTier: 'optimised',
    viewMode: 'split', // split | notes | code
    previewDayIndex: null,
    selectedLogDate: getTodayIsoLocal(),
    filters: {
      search: '',
      type: 'all', // all | dsa | design | behavioral | solved | notes | todo
      diff: 'all'  // all | E | M | H
    },
    conceptSearch: '',
    expandedWeeks: new Set([1]),
    expandedDays: new Set(),
    currentJavaSource: ''
  };

  const els = {
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    homeBtn: document.getElementById('homeBtn'),
    modeButtons: document.querySelectorAll('.mode-btn'),
    conceptsCount: document.getElementById('conceptsCount'),
    roadmapControls: document.getElementById('roadmapControls'),
    conceptsControls: document.getElementById('conceptsControls'),
    searchInput: document.getElementById('searchInput'),
    conceptSearchInput: document.getElementById('conceptSearchInput'),
    typeFilters: document.getElementById('typeFilters'),
    diffFilters: document.getElementById('diffFilters'),
    treeContainer: document.getElementById('treeContainer'),
    dashboardView: document.getElementById('dashboardView'),
    problemView: document.getElementById('problemView'),
    conceptView: document.getElementById('conceptView'),
    solvedStat: document.getElementById('solvedStat'),
    notesStat: document.getElementById('notesStat'),
    miniBarFill: document.getElementById('miniBarFill'),
    randomBtn: document.getElementById('randomBtn'),
    themeBtn: document.getElementById('themeBtn')
  };

  function getTodayIsoLocal() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function diffDaysIso(fromIso, toIso) {
    if (!fromIso || !toIso) return 0;
    const [y1, m1, d1] = fromIso.split('-').map(Number);
    const [y2, m2, d2] = toIso.split('-').map(Number);
    const utc1 = Date.UTC(y1, m1 - 1, d1);
    const utc2 = Date.UTC(y2, m2 - 1, d2);
    return Math.floor((utc2 - utc1) / 86400000);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Single-pass Java syntax highlighter that escapes each token safely.
   */
  function highlightJava(code) {
    const tokenRe = /\/\*[\s\S]*?\*\/|\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[A-Za-z_]\w*|\b(?:public|private|protected|class|interface|enum|extends|implements|static|final|void|return|if|else|for|while|do|switch|case|default|break|continue|new|try|catch|finally|throw|throws|import|package|this|super|boolean|int|long|double|float|char|byte|short|true|false|null)\b|\b(?:String|Integer|Long|Double|Boolean|Character|List|ArrayList|LinkedList|Map|HashMap|TreeMap|Set|HashSet|TreeSet|Queue|Deque|ArrayDeque|PriorityQueue|Stack|Arrays|Collections|Math|StringBuilder|Object)\b|\b\d+(?:\.\d+)?[LlFf]?\b/g;

    const kwSet = new Set([
      'public','private','protected','class','interface','enum','extends','implements',
      'static','final','void','return','if','else','for','while','do','switch','case',
      'default','break','continue','new','try','catch','finally','throw','throws',
      'import','package','this','super','boolean','int','long','double','float',
      'char','byte','short','true','false','null'
    ]);

    const typeSet = new Set([
      'String','Integer','Long','Double','Boolean','Character','List','ArrayList',
      'LinkedList','Map','HashMap','TreeMap','Set','HashSet','TreeSet','Queue',
      'Deque','ArrayDeque','PriorityQueue','Stack','Arrays','Collections','Math',
      'StringBuilder','Object'
    ]);

    let out = '';
    let lastIndex = 0;
    let match;
    while ((match = tokenRe.exec(code)) !== null) {
      if (match.index > lastIndex) {
        out += escapeHtml(code.slice(lastIndex, match.index));
      }
      const tok = match[0];
      let cls = '';
      if (tok.startsWith('/*') || tok.startsWith('//')) cls = 'tok-com';
      else if (tok.startsWith('"') || tok.startsWith("'")) cls = 'tok-str';
      else if (tok.startsWith('@')) cls = 'tok-ann';
      else if (kwSet.has(tok)) cls = 'tok-kw';
      else if (typeSet.has(tok)) cls = 'tok-type';
      else if (/^\d/.test(tok)) cls = 'tok-num';

      out += cls ? `<span class="${cls}">${escapeHtml(tok)}</span>` : escapeHtml(tok);
      lastIndex = tokenRe.lastIndex;
    }
    if (lastIndex < code.length) {
      out += escapeHtml(code.slice(lastIndex));
    }

    const lines = out.split(/\r?\n/);
    return `<table class="code-table"><tbody>${lines
      .map((line, i) => `<tr><td class="code-ln">${i + 1}</td><td class="code-src">${line || ' '}</td></tr>`)
      .join('')}</tbody></table>`;
  }

  /**
   * Dependency-free Markdown renderer supporting headings, lists, code blocks, links, and tables.
   */
  function renderMarkdown(md) {
    const cleaned = md.replace(/<!--[\s\S]*?-->/g, '').trim();
    const codeBlocks = [];
    const withPlaceholders = cleaned.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, body) => {
      const idx = codeBlocks.length;
      const html = lang.toLowerCase() === 'java'
        ? `<pre><code>${highlightJava(body.trimEnd())}</code></pre>`
        : `<pre><code>${escapeHtml(body.trimEnd())}</code></pre>`;
      codeBlocks.push(html);
      return `\n@@CODEBLOCK_${idx}@@\n`;
    });

    const formatInline = (text) => {
      let s = escapeHtml(text);
      s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
        const cleanHref = href.trim();
        const javaMatch = cleanHref.match(/^\.\/(bruteforce|better|optimised)\.java$/i);
        if (javaMatch) {
          const tier = javaMatch[1].toLowerCase();
          return `<a href="#java-${tier}" data-java-tab="${tier}">${label}</a>`;
        }
        const safeHref = /^https?:\/\//i.test(cleanHref) ? cleanHref : '#';
        return `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      });
      s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      return s;
    };

    const parseTableRow = (line) =>
      line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

    const isTableSep = (line) =>
      /^\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$/.test(line.trim());

    const lines = withPlaceholders.split(/\r?\n/);
    const html = [];
    let inList = false;

    const closeList = () => {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trimEnd();
      const cbMatch = line.match(/^@@CODEBLOCK_(\d+)@@$/);
      if (cbMatch) {
        closeList();
        html.push(codeBlocks[Number(cbMatch[1])]);
        continue;
      }

      if (!line.trim()) {
        closeList();
        continue;
      }

      // Markdown table detection
      if (line.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
        closeList();
        const headers = parseTableRow(line);
        i += 2;
        const rows = [];
        while (i < lines.length && lines[i].trim().includes('|')) {
          rows.push(parseTableRow(lines[i]));
          i++;
        }
        i--;
        html.push(
          `<div class="md-table-wrap"><table class="md-table"><thead><tr>${headers
            .map((h) => `<th>${formatInline(h)}</th>`)
            .join('')}</tr></thead><tbody>${rows
            .map((r) => `<tr>${r.map((c) => `<td>${formatInline(c)}</td>`).join('')}</tr>`)
            .join('')}</tbody></table></div>`
        );
        continue;
      }

      if (/^---+$/.test(line.trim())) {
        closeList();
        html.push('<hr />');
        continue;
      }

      const hMatch = line.match(/^(#{1,3})\s+(.*)$/);
      if (hMatch) {
        closeList();
        const level = hMatch[1].length;
        html.push(`<h${level}>${formatInline(hMatch[2])}</h${level}>`);
        continue;
      }

      if (line.startsWith('> ')) {
        closeList();
        html.push(`<blockquote>${formatInline(line.slice(2))}</blockquote>`);
        continue;
      }

      const listMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
      if (listMatch) {
        if (!inList) {
          html.push('<ul>');
          inList = true;
        }
        let itemText = listMatch[2];
        if (itemText.startsWith('[ ] ')) itemText = '☐ ' + itemText.slice(4);
        else if (/^\[x\] /i.test(itemText)) itemText = '☑ ' + itemText.slice(4);
        html.push(`<li>${formatInline(itemText)}</li>`);
        continue;
      }

      closeList();
      html.push(`<p>${formatInline(line)}</p>`);
    }
    closeList();
    return html.join('\n');
  }

  function updateStatsBar() {
    if (!state.data) return;
    const { questions, repoSolved, repoNotes, concepts } = state.data.totals;
    const pct = questions ? Math.round((repoSolved / questions) * 100) : 0;

    els.solvedStat.textContent = `${repoSolved} / ${questions} Solved (${pct}%)`;
    els.notesStat.textContent = `${repoNotes} Notes`;
    els.miniBarFill.style.width = `${pct}%`;
    els.conceptsCount.textContent = String(concepts || 0);
  }

  function setModeUI(mode) {
    state.mode = mode;
    els.modeButtons.forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
    const isConcepts = mode === 'concepts';
    els.roadmapControls.classList.toggle('hidden', isConcepts);
    els.conceptsControls.classList.toggle('hidden', !isConcepts);
    renderSidebar();
  }

  function matchesFilters(day, q) {
    const { search, type, diff } = state.filters;
    if (type === 'dsa' && day.type !== 'dsa') return false;
    if (type === 'design' && day.type !== 'design') return false;
    if (type === 'behavioral' && day.type !== 'behavioral') return false;
    if (type === 'solved' && q.status !== 'solved') return false;
    if (type === 'notes' && !q.hasNotes) return false;
    if (type === 'todo' && q.status !== 'todo') return false;

    if (diff !== 'all' && q.diff !== diff) return false;

    if (search) {
      const hay = `${q.name} ${day.category} week ${day.week} day ${day.day} ${q.diff || ''} ${q.type || ''}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  }

  function getStatusIcon(q) {
    if (q.status === 'solved') return '✅';
    if (q.status === 'revise') return '🔖';
    if (q.status === 'in-progress' || q.hasNotes) return '📝';
    return '○';
  }

  function renderSidebar() {
    if (!state.data) return;
    if (state.mode === 'concepts') {
      renderConceptsSidebar();
    } else {
      renderRoadmapTree();
    }
  }

  function renderConceptsSidebar() {
    const concepts = state.data.concepts || [];
    const query = state.conceptSearch.toLowerCase();
    const filtered = concepts.filter(
      (c) => !query || `${c.title} ${c.group} ${c.path}`.toLowerCase().includes(query)
    );

    const groups = new Map();
    for (const c of filtered) {
      if (!groups.has(c.group)) groups.set(c.group, []);
      groups.get(c.group).push(c);
    }

    const frag = document.createDocumentFragment();
    for (const [groupName, items] of groups.entries()) {
      const box = document.createElement('div');
      box.className = 'week-group';

      const hdr = document.createElement('div');
      hdr.className = 'week-header';
      hdr.style.cursor = 'default';
      hdr.innerHTML = `<span>📁 ${escapeHtml(groupName)}</span><span class="week-meta">${items.length}</span>`;
      box.appendChild(hdr);

      const body = document.createElement('div');
      body.className = 'week-body';
      for (const c of items) {
        const btn = document.createElement('button');
        btn.className = `q-item ${state.selectedConceptId === c.id ? 'active' : ''}`;
        btn.innerHTML = `
          <span class="q-item-left">
            <span class="status-dot">📄</span>
            <span class="q-title">${escapeHtml(c.title)}</span>
          </span>
        `;
        btn.addEventListener('click', () => selectConcept(c.id));
        body.appendChild(btn);
      }
      box.appendChild(body);
      frag.appendChild(box);
    }

    els.treeContainer.innerHTML = '';
    if (frag.childNodes.length === 0) {
      els.treeContainer.innerHTML = '<div class="empty-hint">No concept notes match your search. Add <code>.md</code> files to <code>Concepts/</code> and push to GitHub.</div>';
    } else {
      els.treeContainer.appendChild(frag);
    }
  }

  function renderRoadmapTree() {
    const searching = Boolean(state.filters.search || state.filters.type !== 'all' || state.filters.diff !== 'all');
    const frag = document.createDocumentFragment();

    for (const wk of state.data.weeks) {
      const weekDays = [];
      let wkTotal = 0;
      let wkSolved = 0;

      for (const day of wk.days) {
        if (day.type === 'revision') {
          const revMatches =
            (!state.filters.search || `${day.category} ${day.title || ''} day ${day.day} week ${wk.week}`.toLowerCase().includes(state.filters.search.toLowerCase())) &&
            state.filters.type === 'all' &&
            state.filters.diff === 'all';
          if (revMatches) {
            weekDays.push({ day, questions: [], isRevision: true });
          }
          continue;
        }

        const matchedQs = day.questions.filter((q) => matchesFilters(day, q));
        wkTotal += day.questions.length;
        wkSolved += day.questions.filter((q) => q.status === 'solved').length;
        if (matchedQs.length > 0) {
          weekDays.push({ day, questions: matchedQs, isRevision: false });
        }
      }

      if (weekDays.length === 0) continue;

      const isWeekOpen = searching || state.expandedWeeks.has(wk.week);
      const wkEl = document.createElement('div');
      wkEl.className = 'week-group';

      const wkBtn = document.createElement('button');
      wkBtn.className = 'week-header';
      wkBtn.innerHTML = `
        <span>${isWeekOpen ? '▾' : '▸'} Week ${wk.week}</span>
        <span class="week-meta">${wkSolved}/${wkTotal}</span>
      `;
      wkBtn.addEventListener('click', () => {
        if (state.expandedWeeks.has(wk.week)) state.expandedWeeks.delete(wk.week);
        else state.expandedWeeks.add(wk.week);
        renderRoadmapTree();
      });
      wkEl.appendChild(wkBtn);

      if (isWeekOpen) {
        const wkBody = document.createElement('div');
        wkBody.className = 'week-body';

        for (const entry of weekDays) {
          const { day, questions, isRevision } = entry;
          const dayKey = String(day.day);

          if (isRevision) {
            const revId = `rev::${day.day}`;
            const revBtn = document.createElement('button');
            revBtn.className = `q-item ${state.selectedId === revId ? 'active' : ''}`;
            revBtn.innerHTML = `
              <span class="q-item-left">
                <span class="status-dot">↻</span>
                <span class="q-title">Day ${day.day}: ${escapeHtml(day.category)}</span>
              </span>
              <span class="badge badge-revision">Rev</span>
            `;
            revBtn.addEventListener('click', () => selectItem(revId));
            wkBody.appendChild(revBtn);
            continue;
          }

          const isDayOpen = searching || state.expandedDays.has(dayKey);
          const dayGroup = document.createElement('div');
          dayGroup.className = 'day-group';

          const dayBtn = document.createElement('button');
          dayBtn.className = 'day-header';
          dayBtn.innerHTML = `
            <span>${isDayOpen ? '▾' : '▸'} Day ${day.day} · ${escapeHtml(day.category)}</span>
            <span>${questions.length}</span>
          `;
          dayBtn.addEventListener('click', () => {
            if (state.expandedDays.has(dayKey)) state.expandedDays.delete(dayKey);
            else state.expandedDays.add(dayKey);
            renderRoadmapTree();
          });
          dayGroup.appendChild(dayBtn);

          if (isDayOpen) {
            const qList = document.createElement('div');
            qList.className = 'day-questions';
            for (const q of questions) {
              const badgeCls = q.diff ? `badge-${q.diff}` : `badge-${day.type}`;
              const badgeText = q.diff || (day.type === 'design' ? 'Design' : 'Behav');

              const qBtn = document.createElement('button');
              qBtn.className = `q-item ${state.selectedId === q.id ? 'active' : ''}`;
              qBtn.title = q.name;
              qBtn.innerHTML = `
                <span class="q-item-left">
                  <span class="status-dot">${getStatusIcon(q)}</span>
                  <span class="q-title">${escapeHtml(q.name)}</span>
                </span>
                <span class="badge ${badgeCls}">${escapeHtml(badgeText)}</span>
              `;
              qBtn.addEventListener('click', () => selectItem(q.id));
              qList.appendChild(qBtn);
            }
            dayGroup.appendChild(qList);
          }

          wkBody.appendChild(dayGroup);
        }

        wkEl.appendChild(wkBody);
      }

      frag.appendChild(wkEl);
    }

    els.treeContainer.innerHTML = '';
    if (frag.childNodes.length === 0) {
      els.treeContainer.innerHTML = '<div class="empty-hint">No matching items found.</div>';
    } else {
      els.treeContainer.appendChild(frag);
    }
  }

  function getFlatDays() {
    const days = [];
    for (const wk of state.data.weeks) {
      for (const day of wk.days) {
        days.push({ week: wk, day });
      }
    }
    return days;
  }

  function getDefaultTargetDayIndex(flatDays) {
    if (state.tracker.activeDayOverride !== null && state.tracker.activeDayOverride !== undefined) {
      const idx = flatDays.findIndex((d) => String(d.day.day) === String(state.tracker.activeDayOverride));
      if (idx !== -1) return idx;
    }
    const today = getTodayIsoLocal();
    const start = state.tracker.startDate || today;
    const elapsed = Math.max(0, diffDaysIso(start, today));
    return Math.min(elapsed, Math.max(0, flatDays.length - 1));
  }

  function computeCommitStreak(activityByDate) {
    const dates = Object.keys(activityByDate || {}).sort();
    if (!dates.length) return 0;
    const set = new Set(dates);
    const today = getTodayIsoLocal();
    let cursor = today;

    if (!set.has(cursor)) {
      const [y, m, d] = cursor.split('-').map(Number);
      const prev = new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
      if (!set.has(prev)) return 0;
      cursor = prev;
    }

    let streak = 0;
    while (set.has(cursor)) {
      streak++;
      const [y, m, d] = cursor.split('-').map(Number);
      cursor = new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
    }
    return streak;
  }

  function renderDashboard() {
    state.selectedId = null;
    state.selectedConceptId = null;
    setModeUI('dashboard');
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    els.problemView.classList.add('hidden');
    els.conceptView.classList.add('hidden');
    els.dashboardView.classList.remove('hidden');

    const { totals, weeks, activityByDate = {}, concepts = [] } = state.data;
    const flatDays = getFlatDays();
    const defaultDayIdx = getDefaultTargetDayIndex(flatDays);
    if (state.previewDayIndex === null) state.previewDayIndex = defaultDayIdx;
    const targetIdx = Math.max(0, Math.min(state.previewDayIndex, flatDays.length - 1));
    const targetEntry = flatDays[targetIdx];

    const todayStr = getTodayIsoLocal();
    const logDate = state.selectedLogDate || todayStr;
    const dayActivity = activityByDate[logDate] || { questions: [], concepts: [], trackerUpdated: false };
    const dailyReflections = (state.tracker.dailyNotes && state.tracker.dailyNotes[logDate]) || [];
    const streak = computeCommitStreak(activityByDate);

    const targetQs = targetEntry.day.questions || [];
    const targetSolved = targetQs.filter((q) => q.status === 'solved').length;
    const recentDates = Array.from(
      new Set([todayStr, ...Object.keys(activityByDate), ...Object.keys(state.tracker.dailyNotes || {})])
    )
      .sort()
      .reverse()
      .slice(0, 6);

    const touchedQuestions = (dayActivity.questions || [])
      .map((id) => state.itemById.get(id))
      .filter(Boolean);
    const touchedConcepts = (dayActivity.concepts || [])
      .map((id) => state.conceptsById.get(id))
      .filter(Boolean);

    els.dashboardView.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val">${totals.repoSolved} / ${totals.questions}</div>
          <div class="stat-lbl">Solved in Repo</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${totals.repoNotes}</div>
          <div class="stat-lbl">Problem Notes Written</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${concepts.length}</div>
          <div class="stat-lbl">Concept & Learning Files</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${streak}d</div>
          <div class="stat-lbl">Git Commit Streak</div>
        </div>
      </div>

      <div class="dashboard-grid-2">
        <!-- Today's Target -->
        <section class="section-card">
          <div class="section-header">
            <h2>🎯 Today's Target — Day ${escapeHtml(targetEntry.day.day)}</h2>
            <div style="display:flex;gap:6px;align-items:center;">
              <button class="btn" id="targetPrevBtn" ${targetIdx <= 0 ? 'disabled' : ''}>←</button>
              <button class="btn" id="targetTodayBtn">Today</button>
              <button class="btn" id="targetNextBtn" ${targetIdx >= flatDays.length - 1 ? 'disabled' : ''}>→</button>
            </div>
          </div>

          <div class="section-sub">
            Week ${targetEntry.week.week} · <strong>${escapeHtml(targetEntry.day.category)}</strong>
            ${targetQs.length ? ` · ${targetSolved}/${targetQs.length} done` : ''}
            ${state.tracker.startDate ? ` · Start: <code>${escapeHtml(state.tracker.startDate)}</code>` : ''}
          </div>

          ${targetEntry.day.type === 'revision' || targetQs.length === 0 ? `
            <div class="target-list">
              <button class="target-item" data-jump-id="rev::${escapeHtml(targetEntry.day.day)}">
                <span class="target-item-left">
                  <span>↻</span>
                  <span>${escapeHtml(targetEntry.day.title || targetEntry.day.category)}</span>
                </span>
                <span class="badge badge-revision">Open Revision</span>
              </button>
            </div>
          ` : `
            <div class="target-list">
              ${targetQs.map((q) => {
                const badgeCls = q.diff ? `badge-${q.diff}` : `badge-${targetEntry.day.type}`;
                const badgeTxt = q.diff || targetEntry.day.type;
                return `
                  <button class="target-item" data-jump-id="${escapeHtml(q.id)}">
                    <span class="target-item-left">
                      <span>${getStatusIcon(q)}</span>
                      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(q.name)}</span>
                    </span>
                    <span class="target-item-meta">
                      ${q.hasNotes ? '<span class="badge badge-solved">Notes</span>' : ''}
                      <span class="badge ${badgeCls}">${escapeHtml(badgeTxt)}</span>
                    </span>
                  </button>
                `;
              }).join('')}
            </div>
          `}

          ${(state.tracker.todayTargets && state.tracker.todayTargets.length) ? `
            <div class="custom-targets">
              <h3>Repo Targets (from <code>daily-tracker.json</code>)</h3>
              <ul class="bullet-list">
                ${state.tracker.todayTargets.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </section>

        <!-- What I Did Today -->
        <section class="section-card">
          <div class="section-header">
            <h2>✅ What I Did (${logDate === todayStr ? 'Today' : escapeHtml(logDate)})</h2>
            <input type="date" id="logDatePicker" class="date-input" value="${escapeHtml(logDate)}" />
          </div>

          <div class="filter-row" style="margin-bottom:12px;">
            ${recentDates.map((d) => `
              <button class="chip ${d === logDate ? 'active' : ''}" data-log-date="${escapeHtml(d)}">
                ${d === todayStr ? 'Today' : escapeHtml(d)}
              </button>
            `).join('')}
          </div>

          ${(!touchedQuestions.length && !touchedConcepts.length && !dailyReflections.length) ? `
            <div class="empty-hint">
              No Git commits recorded for <strong>${escapeHtml(logDate)}</strong> yet.<br /><br />
              Push changes to <code>Week-*/</code>, <code>Concepts/</code>, or <code>daily-tracker.json</code> and your activity will appear here automatically.
            </div>
          ` : `
            ${touchedQuestions.length ? `
              <div class="activity-group">
                <h3>Problems Updated (${touchedQuestions.length})</h3>
                <div class="target-list">
                  ${touchedQuestions.map((it) => `
                    <button class="target-item" data-jump-id="${escapeHtml(it.id)}">
                      <span class="target-item-left">
                        <span>${getStatusIcon(it.q)}</span>
                        <span>${escapeHtml(it.q.name)}</span>
                      </span>
                      <span class="badge badge-todo">Day ${escapeHtml(it.day.day)}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${touchedConcepts.length ? `
              <div class="activity-group">
                <h3>Concepts & Learnings Updated (${touchedConcepts.length})</h3>
                <div class="target-list">
                  ${touchedConcepts.map((c) => `
                    <button class="target-item" data-concept-id="${escapeHtml(c.id)}">
                      <span class="target-item-left">
                        <span>📄</span>
                        <span>${escapeHtml(c.title)}</span>
                      </span>
                      <span class="badge badge-todo">${escapeHtml(c.group)}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${dailyReflections.length ? `
              <div class="activity-group">
                <h3>Daily Notes (from <code>daily-tracker.json</code>)</h3>
                <ul class="bullet-list">
                  ${dailyReflections.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          `}
        </section>
      </div>

      <!-- Concepts Quick Access -->
      <section class="section-card">
        <div class="section-header">
          <h2>📚 Concepts, Cheatsheets & Learnings (${concepts.length})</h2>
          <button class="btn btn-primary" id="openConceptsBtn">Open Concepts Hub →</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${concepts.map((c) => `
            <button class="btn" data-concept-id="${escapeHtml(c.id)}">📄 ${escapeHtml(c.title)}</button>
          `).join('')}
        </div>
      </section>

      <!-- Weekly Progress -->
      <section class="section-card">
        <div class="section-header">
          <h2>Weekly Progress</h2>
        </div>
        <div class="week-progress-grid">
          ${weeks.map((wk) => {
            const qs = wk.days.flatMap((d) => d.questions || []);
            const done = qs.filter((q) => q.status === 'solved').length;
            const pct = qs.length ? Math.round((done / qs.length) * 100) : 0;
            const firstTarget = qs[0]?.id || (wk.days[0] ? `rev::${wk.days[0].day}` : '');
            return `
              <button class="wk-card" data-week-jump="${wk.week}" data-first-id="${escapeHtml(firstTarget)}">
                <div class="wk-card-top">
                  <span>Week ${wk.week}</span>
                  <span>${done}/${qs.length}</span>
                </div>
                <div style="font-size:11.5px;color:var(--text-muted);margin-bottom:8px;">${escapeHtml(wk.weekTitle)}</div>
                <div class="wk-bar"><div class="wk-bar-fill" style="width:${pct}%"></div></div>
              </button>
            `;
          }).join('')}
        </div>
      </section>
    `;

    document.getElementById('targetPrevBtn')?.addEventListener('click', () => {
      state.previewDayIndex = Math.max(0, targetIdx - 1);
      renderDashboard();
    });
    document.getElementById('targetTodayBtn')?.addEventListener('click', () => {
      state.previewDayIndex = defaultDayIdx;
      renderDashboard();
    });
    document.getElementById('targetNextBtn')?.addEventListener('click', () => {
      state.previewDayIndex = Math.min(flatDays.length - 1, targetIdx + 1);
      renderDashboard();
    });

    document.getElementById('logDatePicker')?.addEventListener('change', (e) => {
      if (e.target.value) {
        state.selectedLogDate = e.target.value;
        renderDashboard();
      }
    });

    els.dashboardView.querySelectorAll('[data-log-date]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedLogDate = btn.dataset.logDate;
        renderDashboard();
      });
    });

    document.getElementById('openConceptsBtn')?.addEventListener('click', () => {
      const first = (state.data.concepts || [])[0];
      if (first) selectConcept(first.id);
      else setModeUI('concepts');
    });

    els.dashboardView.querySelectorAll('[data-jump-id]').forEach((btn) => {
      btn.addEventListener('click', () => selectItem(btn.dataset.jumpId));
    });

    els.dashboardView.querySelectorAll('[data-concept-id]').forEach((btn) => {
      btn.addEventListener('click', () => selectConcept(btn.dataset.conceptId));
    });

    els.dashboardView.querySelectorAll('[data-week-jump]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.expandedWeeks.add(Number(btn.dataset.weekJump));
        if (btn.dataset.firstId) selectItem(btn.dataset.firstId);
      });
    });
  }

  async function fetchText(relPath) {
    const res = await fetch(`./${relPath}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${relPath}`);
    return res.text();
  }

  async function loadJavaTab(item, tier) {
    state.activeTier = tier;
    const tabs = els.problemView.querySelectorAll('.pane-tab[data-tier]');
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tier === tier));

    const codeBody = document.getElementById('codeBody');
    const codeFooter = document.getElementById('codeFooter');
    if (!codeBody) return;

    const relFile = `${item.q.path}/${tier}.java`;
    codeBody.innerHTML = '<div style="padding:16px;color:var(--text-muted)">Loading Java source...</div>';
    if (codeFooter) codeFooter.textContent = relFile;

    try {
      const src = await fetchText(relFile);
      state.currentJavaSource = src;
      codeBody.innerHTML = highlightJava(src);
    } catch (err) {
      state.currentJavaSource = '';
      codeBody.innerHTML = `<div class="alert-box" style="margin:14px;">Could not load <code>${escapeHtml(relFile)}</code> (${escapeHtml(err.message)}). Serve over HTTP (e.g. GitHub Pages or <code>npx serve .</code>).</div>`;
    }
  }

  async function selectConcept(conceptId) {
    const concepts = state.data.concepts || [];
    const idx = concepts.findIndex((c) => c.id === conceptId);
    if (idx === -1) return;
    const concept = concepts[idx];

    state.selectedId = null;
    state.selectedConceptId = conceptId;
    setModeUI('concepts');
    window.location.hash = encodeURIComponent(conceptId);
    els.sidebar.classList.remove('open');

    els.dashboardView.classList.add('hidden');
    els.problemView.classList.add('hidden');
    els.conceptView.classList.remove('hidden');

    const prevC = idx > 0 ? concepts[idx - 1] : null;
    const nextC = idx < concepts.length - 1 ? concepts[idx + 1] : null;

    els.conceptView.innerHTML = `
      <div class="problem-header">
        <div>
          <div class="breadcrumb">Concepts & Learnings › ${escapeHtml(concept.group)}</div>
          <div class="problem-title-row">
            <h1>${escapeHtml(concept.title)}</h1>
            ${concept.lastUpdated ? `<span class="badge badge-todo">Updated ${escapeHtml(concept.lastUpdated)}</span>` : ''}
          </div>
        </div>
        <div class="problem-actions">
          <button class="btn" id="prevConceptBtn" ${!prevC ? 'disabled' : ''}>← Prev</button>
          <button class="btn" id="nextConceptBtn" ${!nextC ? 'disabled' : ''}>Next →</button>
        </div>
      </div>
      <div class="workspace-panes single-pane">
        <div class="pane">
          <div class="pane-header"><strong>${escapeHtml(concept.path)}</strong></div>
          <div class="pane-body md-body" id="conceptBody">Loading concept note...</div>
          <div class="path-footer">${escapeHtml(concept.path)}</div>
        </div>
      </div>
    `;

    document.getElementById('prevConceptBtn')?.addEventListener('click', () => prevC && selectConcept(prevC.id));
    document.getElementById('nextConceptBtn')?.addEventListener('click', () => nextC && selectConcept(nextC.id));

    try {
      const md = await fetchText(concept.path);
      document.getElementById('conceptBody').innerHTML = renderMarkdown(md);
    } catch (err) {
      document.getElementById('conceptBody').innerHTML = `<div class="alert-box">Could not load <code>${escapeHtml(concept.path)}</code> (${escapeHtml(err.message)}).</div>`;
    }
  }

  async function selectItem(id) {
    const idx = state.flatItems.findIndex((it) => it.id === id);
    if (idx === -1) return;
    const item = state.flatItems[idx];

    state.selectedId = id;
    state.selectedConceptId = null;
    state.expandedWeeks.add(item.week.week);
    state.expandedDays.add(String(item.day.day));
    setModeUI('roadmap');
    window.location.hash = encodeURIComponent(id);
    els.sidebar.classList.remove('open');

    els.dashboardView.classList.add('hidden');
    els.conceptView.classList.add('hidden');
    els.problemView.classList.remove('hidden');

    const prevItem = idx > 0 ? state.flatItems[idx - 1] : null;
    const nextItem = idx < state.flatItems.length - 1 ? state.flatItems[idx + 1] : null;

    if (item.isRevision) {
      els.problemView.innerHTML = `
        <div class="problem-header">
          <div>
            <div class="breadcrumb">Week ${item.week.week} › Day ${item.day.day} · ${escapeHtml(item.day.category)}</div>
            <div class="problem-title-row">
              <h1>Day ${item.day.day} — ${escapeHtml(item.day.category)}</h1>
              <span class="badge badge-revision">Revision</span>
            </div>
          </div>
          <div class="problem-actions">
            <button class="btn" id="prevBtn" ${!prevItem ? 'disabled' : ''}>← Prev</button>
            <button class="btn" id="nextBtn" ${!nextItem ? 'disabled' : ''}>Next →</button>
          </div>
        </div>
        <div class="workspace-panes single-pane">
          <div class="pane">
            <div class="pane-header"><strong>README.md</strong></div>
            <div class="pane-body md-body" id="notesBody">Loading revision notes...</div>
            <div class="path-footer">${escapeHtml(item.day.path)}/README.md</div>
          </div>
        </div>
      `;

      document.getElementById('prevBtn')?.addEventListener('click', () => prevItem && selectItem(prevItem.id));
      document.getElementById('nextBtn')?.addEventListener('click', () => nextItem && selectItem(nextItem.id));

      try {
        const md = await fetchText(`${item.day.path}/README.md`);
        document.getElementById('notesBody').innerHTML = renderMarkdown(md);
      } catch (err) {
        document.getElementById('notesBody').innerHTML = `<div class="alert-box">Could not load revision README (${escapeHtml(err.message)}).</div>`;
      }
      return;
    }

    const { q, day, week } = item;
    const badgeCls = q.diff ? `badge-${q.diff}` : `badge-${day.type}`;
    const badgeText = q.diff === 'E' ? 'Easy' : q.diff === 'M' ? 'Medium' : q.diff === 'H' ? 'Hard' : (q.type || day.type);
    const statusBadge =
      q.status === 'solved'
        ? '<span class="badge badge-solved">✅ Repo Solved</span>'
        : q.status === 'revise'
          ? '<span class="badge badge-progress">🔖 Flagged Revise</span>'
          : q.hasNotes
            ? '<span class="badge badge-progress">📝 Notes Added</span>'
            : '<span class="badge badge-todo">○ Pending</span>';

    const singlePane = !q.hasJava || state.viewMode !== 'split';

    els.problemView.innerHTML = `
      <div class="problem-header">
        <div>
          <div class="breadcrumb">Week ${week.week} › Day ${day.day} · ${escapeHtml(day.category)}</div>
          <div class="problem-title-row">
            <h1>${escapeHtml(q.name)}</h1>
            <span class="badge ${badgeCls}">${escapeHtml(badgeText)}</span>
            ${statusBadge}
          </div>
        </div>
        <div class="problem-actions">
          ${q.hasJava ? `
            <div class="view-mode-group">
              <button class="view-mode-btn ${state.viewMode === 'split' ? 'active' : ''}" data-mode="split">Split</button>
              <button class="view-mode-btn ${state.viewMode === 'notes' ? 'active' : ''}" data-mode="notes">Notes</button>
              <button class="view-mode-btn ${state.viewMode === 'code' ? 'active' : ''}" data-mode="code">Code</button>
            </div>
          ` : ''}
          <a class="btn btn-primary" href="${escapeHtml(q.url)}" target="_blank" rel="noopener noreferrer">Open Problem ↗</a>
          <button class="btn" id="prevBtn" ${!prevItem ? 'disabled' : ''}>←</button>
          <button class="btn" id="nextBtn" ${!nextItem ? 'disabled' : ''}>→</button>
        </div>
      </div>

      <div class="workspace-panes ${singlePane ? 'single-pane' : ''}" id="workspacePanes">
        <div class="pane ${q.hasJava && state.viewMode === 'code' ? 'hidden' : ''}" id="notesPane">
          <div class="pane-header">
            <strong>understanding.md</strong>
          </div>
          <div class="pane-body md-body" id="notesBody">Loading notes...</div>
          <div class="path-footer">${escapeHtml(q.path)}/understanding.md</div>
        </div>

        ${q.hasJava ? `
          <div class="pane ${state.viewMode === 'notes' ? 'hidden' : ''}" id="codePane">
            <div class="pane-header">
              <div class="pane-tabs">
                <button class="pane-tab ${state.activeTier === 'bruteforce' ? 'active' : ''}" data-tier="bruteforce">bruteforce.java</button>
                <button class="pane-tab ${state.activeTier === 'better' ? 'active' : ''}" data-tier="better">better.java</button>
                <button class="pane-tab ${state.activeTier === 'optimised' ? 'active' : ''}" data-tier="optimised">optimised.java</button>
              </div>
              <button class="btn" id="copyCodeBtn">Copy</button>
            </div>
            <div class="pane-body code-body" id="codeBody">Loading Java...</div>
            <div class="path-footer" id="codeFooter">${escapeHtml(q.path)}/${state.activeTier}.java</div>
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById('prevBtn')?.addEventListener('click', () => prevItem && selectItem(prevItem.id));
    document.getElementById('nextBtn')?.addEventListener('click', () => nextItem && selectItem(nextItem.id));

    els.problemView.querySelectorAll('.view-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.viewMode = btn.dataset.mode;
        selectItem(q.id);
      });
    });

    els.problemView.querySelectorAll('.pane-tab[data-tier]').forEach((btn) => {
      btn.addEventListener('click', () => loadJavaTab(item, btn.dataset.tier));
    });

    document.getElementById('copyCodeBtn')?.addEventListener('click', async (e) => {
      if (!state.currentJavaSource) return;
      try {
        await navigator.clipboard.writeText(state.currentJavaSource);
        e.target.textContent = 'Copied!';
        setTimeout(() => { e.target.textContent = 'Copy'; }, 1200);
      } catch (_) {}
    });

    const notesBody = document.getElementById('notesBody');
    try {
      const md = await fetchText(`${q.path}/understanding.md`);
      notesBody.innerHTML = renderMarkdown(md);
      notesBody.querySelectorAll('a[data-java-tab]').forEach((a) => {
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          const tier = a.dataset.javaTab;
          if (state.viewMode === 'notes') {
            state.viewMode = 'split';
            state.activeTier = tier;
            selectItem(q.id);
          } else {
            loadJavaTab(item, tier);
          }
        });
      });
    } catch (err) {
      notesBody.innerHTML = `<div class="alert-box">Could not load <code>${escapeHtml(q.path)}/understanding.md</code> (${escapeHtml(err.message)}).</div>`;
    }

    if (q.hasJava) {
      loadJavaTab(item, state.activeTier);
    }
  }

  function buildFlatItems(data) {
    const items = [];
    state.itemById.clear();
    for (const week of data.weeks) {
      for (const day of week.days) {
        if (day.type === 'revision' || !day.questions.length) {
          const item = { id: `rev::${day.day}`, isRevision: true, week, day };
          items.push(item);
          state.itemById.set(item.id, item);
        } else {
          for (const q of day.questions) {
            const item = { id: q.id, isRevision: false, week, day, q };
            items.push(item);
            state.itemById.set(item.id, item);
          }
        }
      }
    }
    state.conceptsById.clear();
    for (const c of data.concepts || []) {
      state.conceptsById.set(c.id, c);
    }
    return items;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    els.themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function routeFromHash() {
    const raw = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (raw.startsWith('concept::') && state.conceptsById.has(raw)) {
      selectConcept(raw);
    } else if (raw && state.itemById.has(raw)) {
      selectItem(raw);
    } else {
      renderDashboard();
    }
  }

  function initControls() {
    applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

    els.themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });

    els.sidebarToggle.addEventListener('click', () => {
      els.sidebar.classList.toggle('open');
    });

    els.homeBtn.addEventListener('click', renderDashboard);

    els.modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (mode === 'dashboard') {
          renderDashboard();
        } else if (mode === 'concepts') {
          if (state.selectedConceptId && state.conceptsById.has(state.selectedConceptId)) {
            selectConcept(state.selectedConceptId);
          } else if (state.data?.concepts?.length) {
            selectConcept(state.data.concepts[0].id);
          } else {
            setModeUI('concepts');
          }
        } else {
          if (state.selectedId && state.itemById.has(state.selectedId)) {
            selectItem(state.selectedId);
          } else if (state.flatItems.length) {
            selectItem(state.flatItems[0].id);
          }
        }
      });
    });

    els.searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      renderRoadmapTree();
    });

    els.conceptSearchInput.addEventListener('input', (e) => {
      state.conceptSearch = e.target.value.trim();
      renderConceptsSidebar();
    });

    els.typeFilters.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        els.typeFilters.querySelectorAll('.chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.type = btn.dataset.filter;
        renderRoadmapTree();
      });
    });

    els.diffFilters.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        els.diffFilters.querySelectorAll('.chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.diff = btn.dataset.diff;
        renderRoadmapTree();
      });
    });

    els.randomBtn.addEventListener('click', () => {
      const pool = state.flatItems.filter((it) => !it.isRevision && it.q.status !== 'solved');
      const list = pool.length ? pool : state.flatItems.filter((it) => !it.isRevision);
      if (list.length) {
        const pick = list[Math.floor(Math.random() * list.length)];
        selectItem(pick.id);
      }
    });

    window.addEventListener('hashchange', routeFromHash);
  }

  async function boot() {
    initControls();
    try {
      const [idxRes, trackerRes] = await Promise.all([
        fetch(`./roadmap-index.json?t=${Date.now()}`),
        fetch(`./daily-tracker.json?t=${Date.now()}`).catch(() => null)
      ]);
      if (!idxRes.ok) throw new Error(`HTTP ${idxRes.status}`);
      state.data = await idxRes.json();
      if (trackerRes && trackerRes.ok) {
        state.tracker = await trackerRes.json();
      }
      state.flatItems = buildFlatItems(state.data);
      updateStatsBar();
      routeFromHash();
    } catch (err) {
      els.treeContainer.innerHTML = `<div class="alert-box" style="margin:8px;">Failed to load <code>roadmap-index.json</code> (${escapeHtml(err.message)}).<br><br>Serve the folder over HTTP (<code>npx serve .</code> or GitHub Pages).</div>`;
    }
  }

  boot();
})();
