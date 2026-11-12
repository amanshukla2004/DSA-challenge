(() => {
  const THEME_KEY = 'dsa_revision_vault_theme';

  /**
   * @typedef {{
   *   totals: { questions: number, repoSolved: number, repoNotes: number, concepts: number, daysCompleted: number, weeksCompleted: number, days: number, weeks: number },
   *   concepts: Array<{ id: string, title: string, group: string, path: string, lastUpdated?: string | null }>,
   *   solvedByDate?: Record<string, string[]>,
   *   activityByDate?: Record<string, any>,
   *   weeks: Array<{ week: number, weekTitle: string, solvedCount: number, totalCount: number, completed: boolean, days: Array<any> }>
   * }} RoadmapIndex
   */

  const state = {
    /** @type {RoadmapIndex | null} */
    data: null,
    /** @type {{ startDate: string | null, activeDayOverride: string | number | null, todayTargets: string[], dailyNotes: Record<string, string[]> }} */
    tracker: { startDate: null, activeDayOverride: null, todayTargets: [], dailyNotes: {} },
    /** @type {Array<any>} */
    flatItems: [],
    /** @type {Map<string, any>} */
    itemById: new Map(),
    /** @type {Map<string, any>} */
    conceptsById: new Map(),
    mode: 'dashboard', // dashboard | roadmap | concepts
    /** @type {string | null} */
    selectedId: null,
    /** @type {string | null} */
    selectedConceptId: null,
    activeTier: 'optimised',
    viewMode: 'split', // split | notes | code
    /** @type {number | null} */
    previewDayIndex: null,
    /** @type {string | null} */
    selectedHeatmapDate: null,
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
    modeButtons: Array.from(document.querySelectorAll('.mode-btn')),
    conceptsCount: document.getElementById('conceptsCount'),
    roadmapControls: document.getElementById('roadmapControls'),
    conceptsControls: document.getElementById('conceptsControls'),
    searchInput: /** @type {HTMLInputElement | null} */ (document.getElementById('searchInput')),
    conceptSearchInput: /** @type {HTMLInputElement | null} */ (document.getElementById('conceptSearchInput')),
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

  function toIsoLocal(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getTodayIsoLocal() {
    return toIsoLocal(new Date());
  }

  function addDaysIso(isoStr, deltaDays) {
    const [y, m, d] = isoStr.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
    return dt.toISOString().slice(0, 10);
  }

  function diffDaysIso(fromIso, toIso) {
    if (!fromIso || !toIso) return 0;
    const [y1, m1, d1] = fromIso.split('-').map(Number);
    const [y2, m2, d2] = toIso.split('-').map(Number);
    return Math.floor((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
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
      'public', 'private', 'protected', 'class', 'interface', 'enum', 'extends', 'implements',
      'static', 'final', 'void', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
      'default', 'break', 'continue', 'new', 'try', 'catch', 'finally', 'throw', 'throws',
      'import', 'package', 'this', 'super', 'boolean', 'int', 'long', 'double', 'float',
      'char', 'byte', 'short', 'true', 'false', 'null'
    ]);

    const typeSet = new Set([
      'String', 'Integer', 'Long', 'Double', 'Boolean', 'Character', 'List', 'ArrayList',
      'LinkedList', 'Map', 'HashMap', 'TreeMap', 'Set', 'HashSet', 'TreeSet', 'Queue',
      'Deque', 'ArrayDeque', 'PriorityQueue', 'Stack', 'Arrays', 'Collections', 'Math',
      'StringBuilder', 'Object'
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

    if (els.solvedStat) els.solvedStat.textContent = `${repoSolved} / ${questions} Solved (${pct}%)`;
    if (els.notesStat) els.notesStat.textContent = `${repoNotes} Notes`;
    if (els.miniBarFill) els.miniBarFill.style.width = `${pct}%`;
    if (els.conceptsCount) els.conceptsCount.textContent = String(concepts || 0);
  }

  function setModeUI(mode) {
    state.mode = mode;
    els.modeButtons.forEach((b) => {
      if (b instanceof HTMLElement) {
        b.classList.toggle('active', b.dataset.mode === mode);
      }
    });

    const isDashboard = mode === 'dashboard';
    const isConcepts = mode === 'concepts';

    els.sidebar?.classList.toggle('hidden', isDashboard);
    els.sidebarToggle?.classList.toggle('hidden', isDashboard);
    els.roadmapControls?.classList.toggle('hidden', isConcepts);
    els.conceptsControls?.classList.toggle('hidden', !isConcepts);

    if (!isDashboard && state.data) {
      renderSidebar();
    }
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
      const hay = `${q.name} ${day.category} week ${day.week} day ${day.day} ${q.diff || ''} ${q.type || ''} ${q.solvedAt || ''}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  }

  function getStatusIndicator(q) {
    if (q.status === 'solved') return '<span class="status-dot dot-g">✓</span>';
    if (q.status === 'revise') return '<span class="status-dot dot-r">!</span>';
    if (q.status === 'in-progress' || q.hasNotes) return '<span class="status-dot dot-y">◐</span>';
    return '<span class="status-dot dot-dim">○</span>';
  }

  function renderSidebar() {
    if (!state.data) return;
    if (state.mode === 'concepts') {
      renderConceptsSidebar();
    } else if (state.mode === 'roadmap') {
      renderRoadmapTree();
    }
  }

  function renderConceptsSidebar() {
    if (!state.data || !els.treeContainer) return;
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
      hdr.innerHTML = `<span>${escapeHtml(groupName)}</span><span class="week-meta">${items.length}</span>`;
      box.appendChild(hdr);

      const body = document.createElement('div');
      body.className = 'week-body';
      for (const c of items) {
        const btn = document.createElement('button');
        btn.className = `q-item ${state.selectedConceptId === c.id ? 'active' : ''}`;
        btn.innerHTML = `
          <span class="q-item-left">
            <span class="status-dot dot-dim">▪</span>
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
    if (!state.data || !els.treeContainer) return;
    const searching = Boolean(state.filters.search || state.filters.type !== 'all' || state.filters.diff !== 'all');
    const frag = document.createDocumentFragment();

    for (const wk of state.data.weeks) {
      const weekDays = [];

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
        if (matchedQs.length > 0) {
          weekDays.push({ day, questions: matchedQs, isRevision: false });
        }
      }

      if (weekDays.length === 0) continue;

      const isWeekOpen = searching || state.expandedWeeks.has(wk.week);
      const wkEl = document.createElement('div');
      wkEl.className = `week-group ${wk.completed ? 'is-complete' : ''}`;

      const wkBtn = document.createElement('button');
      wkBtn.className = `week-header ${wk.completed ? 'is-complete' : ''}`;
      wkBtn.innerHTML = `
        <span>${isWeekOpen ? '▾' : '▸'} Week ${wk.week} ${wk.completed ? '✓' : ''}</span>
        <span class="week-meta">${wk.solvedCount}/${wk.totalCount}</span>
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
            revBtn.className = `q-item ${day.completed ? 'is-complete' : ''} ${state.selectedId === revId ? 'active' : ''}`;
            revBtn.innerHTML = `
              <span class="q-item-left">
                <span class="status-dot ${day.completed ? 'dot-g' : 'dot-dim'}">${day.completed ? '✓' : '↻'}</span>
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

          const dayStateCls = day.completed
            ? 'is-complete'
            : day.solvedCount > 0
              ? 'is-partial'
              : '';

          const dayBtn = document.createElement('button');
          dayBtn.className = `day-header ${dayStateCls}`;
          dayBtn.innerHTML = `
            <span>${isDayOpen ? '▾' : '▸'} Day ${day.day} · ${escapeHtml(day.category)} ${day.completed ? '✓' : ''}</span>
            <span>${day.solvedCount}/${day.totalCount}</span>
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
              const qStateCls =
                q.status === 'solved'
                  ? 'is-complete'
                  : q.status === 'revise'
                    ? 'is-revise'
                    : q.status === 'in-progress'
                      ? 'is-progress'
                      : '';

              const qBtn = document.createElement('button');
              qBtn.className = `q-item ${qStateCls} ${state.selectedId === q.id ? 'active' : ''}`;
              qBtn.title = q.solvedAt ? `${q.name} (Solved ${q.solvedAt})` : q.name;
              qBtn.innerHTML = `
                <span class="q-item-left">
                  ${getStatusIndicator(q)}
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
    if (!state.data) return [];
    const days = [];
    for (const wk of state.data.weeks) {
      for (const day of wk.days) {
        days.push({ week: wk, day });
      }
    }
    return days;
  }

  /**
   * Smart Target Resolver:
   * - If activeDayOverride is set in daily-tracker.json, use it.
   * - Otherwise automatically jump to the first incomplete day so solving 2 days in one day
   *   immediately advances Today's Target to the next unsolved day.
   */
  function getSmartTargetDayIndex(flatDays) {
    if (state.tracker.activeDayOverride !== null && state.tracker.activeDayOverride !== undefined) {
      const idx = flatDays.findIndex((d) => String(d.day.day) === String(state.tracker.activeDayOverride));
      if (idx !== -1) return idx;
    }
    const nextPendingIdx = flatDays.findIndex((d) => !d.day.completed && d.day.type !== 'revision');
    if (nextPendingIdx !== -1) return nextPendingIdx;
    return Math.max(0, flatDays.length - 1);
  }

  function computeSolvedStreak(solvedByDate) {
    const dates = Object.keys(solvedByDate || {}).filter((d) => (solvedByDate[d] || []).length > 0);
    if (!dates.length) return 0;
    const set = new Set(dates);
    const today = getTodayIsoLocal();
    let cursor = today;

    if (!set.has(cursor)) {
      const yesterday = addDaysIso(today, -1);
      if (!set.has(yesterday)) return 0;
      cursor = yesterday;
    }

    let streak = 0;
    while (set.has(cursor)) {
      streak++;
      cursor = addDaysIso(cursor, -1);
    }
    return streak;
  }

  function renderHeatmap(solvedByDate, selectedDate) {
    const today = getTodayIsoLocal();
    const [ty, tm, td] = today.split('-').map(Number);
    const todayUtc = new Date(Date.UTC(ty, tm - 1, td));
    const dayOfWeek = todayUtc.getUTCDay(); // 0=Sun..6=Sat
    const totalWeeks = 24;
    const endOffset = 6 - dayOfWeek;
    const totalDays = totalWeeks * 7;
    const endDateIso = addDaysIso(today, endOffset);
    const startDateIso = addDaysIso(endDateIso, -(totalDays - 1));

    const cells = [];
    for (let i = 0; i < totalDays; i++) {
      const iso = addDaysIso(startDateIso, i);
      const isFuture = iso > today;
      const count = isFuture ? 0 : ((solvedByDate[iso] || []).length);
      let lvl = '';
      if (count >= 6) lvl = 'hm-4';
      else if (count >= 4) lvl = 'hm-3';
      else if (count >= 2) lvl = 'hm-2';
      else if (count >= 1) lvl = 'hm-1';

      const selectedCls = selectedDate === iso ? 'hm-selected' : '';
      const style = isFuture ? 'opacity:0.22;cursor:default;' : '';
      const title = isFuture
        ? `${iso}`
        : `${iso}: ${count} question${count === 1 ? '' : 's'} solved`;

      cells.push(
        `<button class="hm-cell ${lvl} ${selectedCls}" data-hm-date="${iso}" ${isFuture ? 'disabled' : ''} style="${style}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}"></button>`
      );
    }

    return `
      <div class="heatmap-wrap">
        <div class="heatmap-grid">${cells.join('')}</div>
      </div>
      <div class="heatmap-footer">
        <span>${startDateIso} → ${today} (click any square to inspect solved questions)</span>
        <div class="hm-legend">
          <span>Less</span>
          <span class="hm-legend-box" style="background:var(--hm-0)"></span>
          <span class="hm-legend-box hm-1"></span>
          <span class="hm-legend-box hm-2"></span>
          <span class="hm-legend-box hm-3"></span>
          <span class="hm-legend-box hm-4"></span>
          <span>More</span>
        </div>
      </div>
    `;
  }

  function renderProgressMatrix(flatDays) {
    if (!state.data) return '';
    /** @type {Record<string, { label: string, litCls: string, dotCls: string, items: Array<any> }>} */
    const buckets = {
      E: { label: 'Easy', litCls: 'lit-easy', dotCls: 'dot-g', items: [] },
      M: { label: 'Medium', litCls: 'lit-medium', dotCls: 'dot-y', items: [] },
      H: { label: 'Hard', litCls: 'lit-hard', dotCls: 'dot-r', items: [] },
      design: { label: 'System Design', litCls: 'lit-design', dotCls: 'dot-dim', items: [] },
      behavioral: { label: 'Behavioral', litCls: 'lit-behavioral', dotCls: 'dot-dim', items: [] }
    };

    for (const it of state.flatItems) {
      if (it.isRevision) continue;
      if (it.day.type === 'dsa') {
        const key = it.q.diff || 'E';
        if (buckets[key]) buckets[key].items.push(it);
      } else if (buckets[it.day.type]) {
        buckets[it.day.type].items.push(it);
      }
    }

    const questionCards = Object.entries(buckets).map(([key, b]) => {
      const done = b.items.filter((it) => it.q.status === 'solved').length;
      const pct = b.items.length ? Math.round((done / b.items.length) * 100) : 0;
      const cells = b.items.map((it) => {
        const isDone = it.q.status === 'solved';
        const statusTxt = isDone
          ? `Solved${it.q.solvedAt ? ` ${it.q.solvedAt}` : ''}`
          : it.q.hasNotes
            ? 'Notes added'
            : 'Pending';
        const cls = isDone ? b.litCls : it.q.hasNotes ? 'lit-partial' : '';
        return `<button class="p-cell ${cls}" data-jump-id="${escapeHtml(it.id)}" title="${escapeHtml(`${it.q.name} (Day ${it.day.day} · ${statusTxt})`)}"></button>`;
      }).join('');

      return `
        <div class="matrix-box">
          <div class="matrix-box-head">
            <span>${escapeHtml(b.label)}</span>
            <span class="matrix-count">${done}/${b.items.length} (${pct}%)</span>
          </div>
          <div class="block-grid">${cells}</div>
        </div>
      `;
    }).join('');

    const daysDone = flatDays.filter((d) => d.day.completed).length;
    const dayCells = flatDays.map((entry, idx) => {
      const d = entry.day;
      const cls = d.completed ? 'lit-done' : d.solvedCount > 0 ? 'lit-partial' : '';
      const info = d.type === 'revision'
        ? `Day ${d.day} · ${d.category} (${d.completed ? 'Completed' : 'Pending'})`
        : `Day ${d.day} · ${d.category} (${d.solvedCount}/${d.totalCount})`;
      return `<button class="p-cell ${cls}" data-day-idx="${idx}" title="${escapeHtml(info)}"></button>`;
    }).join('');

    const weeks = state.data.weeks || [];
    const weeksDone = weeks.filter((w) => w.completed).length;
    const weekCells = weeks.map((wk) => {
      const cls = wk.completed ? 'lit-done' : wk.solvedCount > 0 ? 'lit-partial' : '';
      const info = `${wk.weekTitle} (${wk.solvedCount}/${wk.totalCount} solved)`;
      return `<button class="w-cell ${cls}" data-week-num="${wk.week}" title="${escapeHtml(info)}">W${wk.week}</button>`;
    }).join('');

    return `
      <section class="section-card">
        <div class="section-header">
          <h2>Progress Matrix</h2>
          <span class="section-sub" style="margin:0;">1 cell = 1 question / day / week (click any block to open)</span>
        </div>
        <div class="matrix-sections">
          <div class="matrix-questions-grid">
            ${questionCards}
          </div>
          <div class="matrix-dw-grid">
            <div class="matrix-box">
              <div class="matrix-box-head">
                <span>Days Completed</span>
                <span class="matrix-count">${daysDone}/${flatDays.length}</span>
              </div>
              <div class="block-grid">${dayCells}</div>
            </div>
            <div class="matrix-box">
              <div class="matrix-box-head">
                <span>Weeks Completed</span>
                <span class="matrix-count">${weeksDone}/${weeks.length}</span>
              </div>
              <div class="week-block-grid">${weekCells}</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderSolvedListCard(title, dateStr, qIds, emptyText) {
    const items = (qIds || [])
      .map((id) => state.itemById.get(id))
      .filter((it) => it && !it.isRevision && it.q);

    const completedDaysToday = new Set();
    for (const it of items) {
      if (it.day.completed) completedDaysToday.add(`Day ${it.day.day}`);
    }

    return `
      <section class="section-card">
        <div class="section-header">
          <h2>${escapeHtml(title)} <span class="badge ${items.length ? 'badge-g' : 'badge-grey'}">${items.length} solved</span></h2>
        </div>
        <div class="section-sub">
          <code>${escapeHtml(dateStr)}</code>
          ${completedDaysToday.size ? ` · ${Array.from(completedDaysToday).map((d) => `<span class="badge badge-g">✓ ${escapeHtml(d)} Done</span>`).join(' ')}` : ''}
        </div>
        ${items.length === 0 ? `
          <div class="empty-hint">${escapeHtml(emptyText)}</div>
        ` : `
          <div class="target-list">
            ${items.map((it) => {
              const badgeCls = it.q.diff ? `badge-${it.q.diff}` : `badge-${it.day.type}`;
              const badgeTxt = it.q.diff || it.day.type;
              return `
                <button class="target-item is-complete" data-jump-id="${escapeHtml(it.id)}">
                  <span class="target-item-left">
                    <span class="dot-g">✓</span>
                    <span class="target-item-title">${escapeHtml(it.q.name)}</span>
                  </span>
                  <span class="target-item-meta">
                    <span class="target-item-sub">Day ${escapeHtml(it.day.day)}</span>
                    <span class="badge ${badgeCls}">${escapeHtml(badgeTxt)}</span>
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        `}
      </section>
    `;
  }

  function renderDashboard() {
    if (!state.data || !els.dashboardView) return;
    state.selectedId = null;
    state.selectedConceptId = null;
    setModeUI('dashboard');
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    els.problemView?.classList.add('hidden');
    els.conceptView?.classList.add('hidden');
    els.dashboardView.classList.remove('hidden');

    const { totals, solvedByDate = {} } = state.data;
    const flatDays = getFlatDays();
    if (!flatDays.length) return;

    const smartIdx = getSmartTargetDayIndex(flatDays);
    if (state.previewDayIndex === null) state.previewDayIndex = smartIdx;
    const targetIdx = Math.max(0, Math.min(state.previewDayIndex, flatDays.length - 1));
    const targetEntry = flatDays[targetIdx];

    const todayStr = getTodayIsoLocal();
    const yesterdayStr = addDaysIso(todayStr, -1);
    const activeLeftDate = state.selectedHeatmapDate || todayStr;
    const leftIds = solvedByDate[activeLeftDate] || [];
    const yesterdayIds = solvedByDate[yesterdayStr] || [];
    const solvedTodayCount = (solvedByDate[todayStr] || []).length;
    const streak = computeSolvedStreak(solvedByDate);

    const startDate = state.tracker.startDate || todayStr;
    const calendarIdx = Math.max(0, Math.min(diffDaysIso(startDate, todayStr), flatDays.length - 1));
    const paceDelta = smartIdx - calendarIdx;
    let paceBadge = '<span class="badge badge-b">On Schedule</span>';
    if (paceDelta > 0) paceBadge = `<span class="badge badge-g">+${paceDelta} Day${paceDelta > 1 ? 's' : ''} Ahead</span>`;
    else if (paceDelta < 0) paceBadge = `<span class="badge badge-y">${Math.abs(paceDelta)} Day${Math.abs(paceDelta) > 1 ? 's' : ''} Behind</span>`;

    const targetQs = targetEntry.day.questions || [];
    const targetDone = targetEntry.day.solvedCount || 0;
    const targetTotal = targetEntry.day.totalCount || targetQs.length;
    const targetPct = targetTotal ? Math.round((targetDone / targetTotal) * 100) : (targetEntry.day.completed ? 100 : 0);

    els.dashboardView.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card ${totals.repoSolved > 0 ? 'accent-g' : ''}">
          <div class="stat-val">${totals.repoSolved} / ${totals.questions}</div>
          <div class="stat-lbl">Questions Solved</div>
        </div>
        <div class="stat-card ${totals.daysCompleted > 0 ? 'accent-g' : ''}">
          <div class="stat-val">${totals.daysCompleted} / ${totals.days}</div>
          <div class="stat-lbl">Days Completed</div>
        </div>
        <div class="stat-card ${totals.weeksCompleted > 0 ? 'accent-g' : ''}">
          <div class="stat-val">${totals.weeksCompleted} / ${totals.weeks}</div>
          <div class="stat-lbl">Weeks Completed</div>
        </div>
        <div class="stat-card ${solvedTodayCount > 0 ? 'accent-g' : ''}">
          <div class="stat-val">${solvedTodayCount}</div>
          <div class="stat-lbl">Solved Today</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${streak}d</div>
          <div class="stat-lbl">Solve Streak</div>
        </div>
      </div>

      <section class="section-card ${targetEntry.day.completed ? 'is-complete' : ''}">
        <div class="section-header">
          <h2>
            Today's Target — Day ${escapeHtml(targetEntry.day.day)}
            ${targetEntry.day.completed ? '<span class="badge badge-g">✓ Day Completed</span>' : paceBadge}
          </h2>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="btn" id="targetPrevBtn" ${targetIdx <= 0 ? 'disabled' : ''}>←</button>
            <button class="btn" id="targetTodayBtn">Next Pending</button>
            <button class="btn" id="targetNextBtn" ${targetIdx >= flatDays.length - 1 ? 'disabled' : ''}>→</button>
          </div>
        </div>

        <div class="section-sub">
          Week ${targetEntry.week.week} ${targetEntry.week.completed ? '<span class="badge badge-g">✓ Week Done</span>' : ''}
          · <strong>${escapeHtml(targetEntry.day.category)}</strong>
          ${targetTotal ? ` · ${targetDone}/${targetTotal} solved (${targetPct}%)` : ''}
        </div>

        <div class="day-progress-bar">
          <div class="day-progress-fill" style="width:${targetPct}%"></div>
        </div>

        ${targetEntry.day.type === 'revision' || targetQs.length === 0 ? `
          <div class="target-list">
            <button class="target-item ${targetEntry.day.completed ? 'is-complete' : ''}" data-jump-id="rev::${escapeHtml(targetEntry.day.day)}">
              <span class="target-item-left">
                <span>${targetEntry.day.completed ? '✓' : '↻'}</span>
                <span class="target-item-title">${escapeHtml(targetEntry.day.title || targetEntry.day.category)}</span>
              </span>
              <span class="badge badge-revision">Open Revision</span>
            </button>
          </div>
        ` : `
          <div class="target-list">
            ${targetQs.map((q) => {
              const badgeCls = q.diff ? `badge-${q.diff}` : `badge-${targetEntry.day.type}`;
              const badgeTxt = q.diff || targetEntry.day.type;
              const isDone = q.status === 'solved';
              return `
                <button class="target-item ${isDone ? 'is-complete' : ''}" data-jump-id="${escapeHtml(q.id)}">
                  <span class="target-item-left">
                    ${getStatusIndicator(q)}
                    <span class="target-item-title">${escapeHtml(q.name)}</span>
                  </span>
                  <span class="target-item-meta">
                    ${q.solvedAt ? `<span class="target-item-sub">Solved ${escapeHtml(q.solvedAt)}</span>` : ''}
                    <span class="badge ${badgeCls}">${escapeHtml(badgeTxt)}</span>
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        `}
      </section>

      <!-- Progress Matrix -->
      ${renderProgressMatrix(flatDays)}

      <section class="section-card">
        <div class="section-header">
          <h2>Solve Heatmap</h2>
          ${state.selectedHeatmapDate ? '<button class="btn" id="clearHeatmapBtn">Reset to Today</button>' : ''}
        </div>
        ${renderHeatmap(solvedByDate, state.selectedHeatmapDate)}
      </section>

      <div class="dashboard-grid-2">
        ${renderSolvedListCard(
          state.selectedHeatmapDate ? `Solved on ${activeLeftDate}` : 'Solved Today',
          activeLeftDate,
          leftIds,
          state.selectedHeatmapDate
            ? `No questions marked solved on ${activeLeftDate}.`
            : 'No questions solved today yet. Solve & push to GitHub to log them here.'
        )}

        ${renderSolvedListCard(
          'Solved Yesterday',
          yesterdayStr,
          yesterdayIds,
          'No questions solved yesterday.'
        )}
      </div>
    `;

    document.getElementById('targetPrevBtn')?.addEventListener('click', () => {
      state.previewDayIndex = Math.max(0, targetIdx - 1);
      renderDashboard();
    });
    document.getElementById('targetTodayBtn')?.addEventListener('click', () => {
      state.previewDayIndex = smartIdx;
      renderDashboard();
    });
    document.getElementById('targetNextBtn')?.addEventListener('click', () => {
      state.previewDayIndex = Math.min(flatDays.length - 1, targetIdx + 1);
      renderDashboard();
    });

    document.getElementById('clearHeatmapBtn')?.addEventListener('click', () => {
      state.selectedHeatmapDate = null;
      renderDashboard();
    });

    els.dashboardView.querySelectorAll('[data-hm-date]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!(btn instanceof HTMLElement)) return;
        const d = btn.dataset.hmDate || null;
        state.selectedHeatmapDate = state.selectedHeatmapDate === d ? null : d;
        renderDashboard();
      });
    });

    els.dashboardView.querySelectorAll('[data-jump-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn instanceof HTMLElement && btn.dataset.jumpId) {
          selectItem(btn.dataset.jumpId);
        }
      });
    });

    els.dashboardView.querySelectorAll('[data-day-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn instanceof HTMLElement && btn.dataset.dayIdx !== undefined) {
          state.previewDayIndex = Number(btn.dataset.dayIdx);
          renderDashboard();
        }
      });
    });

    els.dashboardView.querySelectorAll('[data-week-num]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!(btn instanceof HTMLElement) || !btn.dataset.weekNum || !state.data) return;
        const wkNum = Number(btn.dataset.weekNum);
        state.expandedWeeks.add(wkNum);
        const wk = state.data.weeks.find((w) => w.week === wkNum);
        const firstDay = wk?.days?.[0];
        const firstId = firstDay?.questions?.[0]?.id || (firstDay ? `rev::${firstDay.day}` : null);
        if (firstId) selectItem(firstId);
      });
    });
  }

  async function fetchText(relPath) {
    const res = await fetch(`${encodeURI(`./${relPath}`)}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${relPath}`);
    return res.text();
  }

  async function loadJavaTab(item, tier) {
    state.activeTier = tier;
    const tabs = els.problemView ? els.problemView.querySelectorAll('.pane-tab[data-tier]') : [];
    tabs.forEach((t) => {
      if (t instanceof HTMLElement) {
        t.classList.toggle('active', t.dataset.tier === tier);
      }
    });

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
      const msg = err instanceof Error ? err.message : String(err);
      codeBody.innerHTML = `<div class="alert-box" style="margin:14px;">Could not load <code>${escapeHtml(relFile)}</code> (${escapeHtml(msg)}).</div>`;
    }
  }

  async function selectConcept(conceptId) {
    if (!state.data || !els.conceptView) return;
    const concepts = state.data.concepts || [];
    const idx = concepts.findIndex((c) => c.id === conceptId);
    if (idx === -1) return;
    const concept = concepts[idx];

    state.selectedId = null;
    state.selectedConceptId = conceptId;
    setModeUI('concepts');
    window.location.hash = encodeURIComponent(conceptId);
    els.sidebar?.classList.remove('open');

    els.dashboardView?.classList.add('hidden');
    els.problemView?.classList.add('hidden');
    els.conceptView.classList.remove('hidden');

    const prevC = idx > 0 ? concepts[idx - 1] : null;
    const nextC = idx < concepts.length - 1 ? concepts[idx + 1] : null;

    els.conceptView.innerHTML = `
      <div class="problem-header">
        <div>
          <div class="breadcrumb">Concepts & Learnings › ${escapeHtml(concept.group)}</div>
          <div class="problem-title-row">
            <h1>${escapeHtml(concept.title)}</h1>
            ${concept.lastUpdated ? `<span class="badge badge-b">Updated ${escapeHtml(concept.lastUpdated)}</span>` : ''}
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

    const conceptBody = document.getElementById('conceptBody');
    if (!conceptBody) return;
    try {
      const md = await fetchText(concept.path);
      conceptBody.innerHTML = renderMarkdown(md);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      conceptBody.innerHTML = `<div class="alert-box">Could not load <code>${escapeHtml(concept.path)}</code> (${escapeHtml(msg)}).</div>`;
    }
  }

  async function selectItem(id) {
    if (!state.data || !els.problemView) return;
    const idx = state.flatItems.findIndex((it) => it.id === id);
    if (idx === -1) return;
    const item = state.flatItems[idx];

    state.selectedId = id;
    state.selectedConceptId = null;
    state.expandedWeeks.add(item.week.week);
    state.expandedDays.add(String(item.day.day));
    setModeUI('roadmap');
    window.location.hash = encodeURIComponent(id);
    els.sidebar?.classList.remove('open');

    els.dashboardView?.classList.add('hidden');
    els.conceptView?.classList.add('hidden');
    els.problemView.classList.remove('hidden');

    const prevItem = idx > 0 ? state.flatItems[idx - 1] : null;
    const nextItem = idx < state.flatItems.length - 1 ? state.flatItems[idx + 1] : null;

    if (item.isRevision) {
      els.problemView.innerHTML = `
        <div class="problem-header ${item.day.completed ? 'is-complete' : ''}">
          <div>
            <div class="breadcrumb">Week ${item.week.week} › Day ${item.day.day} · ${escapeHtml(item.day.category)}</div>
            <div class="problem-title-row">
              <h1>Day ${item.day.day} — ${escapeHtml(item.day.category)}</h1>
              <span class="badge badge-revision">Revision</span>
              ${item.day.completed ? '<span class="badge badge-g">✓ Completed</span>' : ''}
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

      const revBody = document.getElementById('notesBody');
      if (!revBody) return;
      try {
        const md = await fetchText(`${item.day.path}/README.md`);
        revBody.innerHTML = renderMarkdown(md);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        revBody.innerHTML = `<div class="alert-box">Could not load revision README (${escapeHtml(msg)}).</div>`;
      }
      return;
    }

    const { q, day, week } = item;
    const badgeCls = q.diff ? `badge-${q.diff}` : `badge-${day.type}`;
    const badgeText = q.diff === 'E' ? 'Easy' : q.diff === 'M' ? 'Medium' : q.diff === 'H' ? 'Hard' : (q.type || day.type);
    const statusBadge =
      q.status === 'solved'
        ? `<span class="badge badge-g">✓ Solved${q.solvedAt ? ` · ${escapeHtml(q.solvedAt)}` : ''}</span>`
        : q.status === 'revise'
          ? '<span class="badge badge-r">! Revise</span>'
          : q.hasNotes
            ? '<span class="badge badge-y">◐ Notes Added</span>'
            : '<span class="badge badge-grey">○ Todo</span>';

    const singlePane = !q.hasJava || state.viewMode !== 'split';

    els.problemView.innerHTML = `
      <div class="problem-header ${q.status === 'solved' ? 'is-complete' : ''}">
        <div>
          <div class="breadcrumb">
            Week ${week.week} ${week.completed ? '(✓ Done)' : ''} ›
            Day ${day.day} · ${escapeHtml(day.category)} ${day.completed ? '(✓ Done)' : ''}
          </div>
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
        if (btn instanceof HTMLElement && btn.dataset.mode) {
          state.viewMode = btn.dataset.mode;
          selectItem(q.id);
        }
      });
    });

    els.problemView.querySelectorAll('.pane-tab[data-tier]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn instanceof HTMLElement && btn.dataset.tier) {
          loadJavaTab(item, btn.dataset.tier);
        }
      });
    });

    const copyBtn = document.getElementById('copyCodeBtn');
    copyBtn?.addEventListener('click', async () => {
      if (!state.currentJavaSource) return;
      try {
        await navigator.clipboard.writeText(state.currentJavaSource);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
      } catch (_) {}
    });

    const notesBody = document.getElementById('notesBody');
    if (notesBody) {
      try {
        const md = await fetchText(`${q.path}/understanding.md`);
        notesBody.innerHTML = renderMarkdown(md);
        notesBody.querySelectorAll('a[data-java-tab]').forEach((a) => {
          a.addEventListener('click', (ev) => {
            ev.preventDefault();
            if (!(a instanceof HTMLElement)) return;
            const tier = a.dataset.javaTab;
            if (!tier) return;
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
        const msg = err instanceof Error ? err.message : String(err);
        notesBody.innerHTML = `<div class="alert-box">Could not load <code>${escapeHtml(q.path)}/understanding.md</code> (${escapeHtml(msg)}).</div>`;
      }
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
    if (els.themeBtn) {
      els.themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  function routeFromHash() {
    if (!state.data) return;
    let raw = '';
    try {
      raw = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    } catch (_) {
      raw = '';
    }
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

    els.themeBtn?.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });

    els.sidebarToggle?.addEventListener('click', () => {
      els.sidebar?.classList.toggle('open');
    });

    els.homeBtn?.addEventListener('click', () => renderDashboard());

    els.modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!state.data || !(btn instanceof HTMLElement)) return;
        const mode = btn.dataset.mode;
        if (mode === 'dashboard') {
          renderDashboard();
        } else if (mode === 'concepts') {
          if (state.selectedConceptId && state.conceptsById.has(state.selectedConceptId)) {
            selectConcept(state.selectedConceptId);
          } else if (state.data.concepts.length) {
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

    els.searchInput?.addEventListener('input', () => {
      state.filters.search = (els.searchInput?.value || '').trim();
      renderRoadmapTree();
    });

    els.conceptSearchInput?.addEventListener('input', () => {
      state.conceptSearch = (els.conceptSearchInput?.value || '').trim();
      renderConceptsSidebar();
    });

    els.typeFilters?.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!(btn instanceof HTMLElement)) return;
        els.typeFilters?.querySelectorAll('.chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.type = btn.dataset.filter || 'all';
        renderRoadmapTree();
      });
    });

    els.diffFilters?.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!(btn instanceof HTMLElement)) return;
        els.diffFilters?.querySelectorAll('.chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.diff = btn.dataset.diff || 'all';
        renderRoadmapTree();
      });
    });

    els.randomBtn?.addEventListener('click', () => {
      if (!state.data) return;
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
    setModeUI('dashboard');
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
      if (state.data) {
        state.flatItems = buildFlatItems(state.data);
        updateStatsBar();
        routeFromHash();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (els.dashboardView) {
        els.dashboardView.innerHTML = `<div class="alert-box">Failed to load <code>roadmap-index.json</code> (${escapeHtml(msg)}). Serve the folder over HTTP (<code>npx serve .</code> or Vercel).</div>`;
      }
    }
  }

  boot();
})();
