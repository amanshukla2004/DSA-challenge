(() => {
  const STORAGE_KEY = 'dsa_revision_vault_progress_v1';
  const THEME_KEY = 'dsa_revision_vault_theme';

  const state = {
    data: null,
    flatItems: [],
    selectedId: null,
    activeTier: 'optimised',
    viewMode: 'split', // split | notes | code
    filters: {
      search: '',
      type: 'all', // all | dsa | design | behavioral | revise | unsolved
      diff: 'all'  // all | E | M | H
    },
    expandedWeeks: new Set([1]),
    expandedDays: new Set(),
    progress: loadProgress(),
    currentJavaSource: ''
  };

  const els = {
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    homeBtn: document.getElementById('homeBtn'),
    searchInput: document.getElementById('searchInput'),
    typeFilters: document.getElementById('typeFilters'),
    diffFilters: document.getElementById('diffFilters'),
    treeContainer: document.getElementById('treeContainer'),
    dashboardView: document.getElementById('dashboardView'),
    problemView: document.getElementById('problemView'),
    solvedStat: document.getElementById('solvedStat'),
    reviseStat: document.getElementById('reviseStat'),
    miniBarFill: document.getElementById('miniBarFill'),
    randomBtn: document.getElementById('randomBtn'),
    exportBtn: document.getElementById('exportBtn'),
    importInput: document.getElementById('importInput'),
    themeBtn: document.getElementById('themeBtn')
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          solved: parsed.solved || {},
          revise: parsed.revise || {}
        };
      }
    } catch (_) {}
    return { solved: {}, revise: {} };
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    updateStatsBar();
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
   * Lightweight, dependency-free Markdown renderer.
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

    const lines = withPlaceholders.split(/\r?\n/);
    const html = [];
    let inList = false;

    const closeList = () => {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
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
        if (itemText.startsWith('[ ] ')) {
          itemText = '☐ ' + itemText.slice(4);
        } else if (/^\[x\] /i.test(itemText)) {
          itemText = '☑ ' + itemText.slice(4);
        }
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
    const total = state.data.totals.questions;
    const solvedCount = Object.values(state.progress.solved).filter(Boolean).length;
    const reviseCount = Object.values(state.progress.revise).filter(Boolean).length;
    const pct = total ? Math.round((solvedCount / total) * 100) : 0;

    els.solvedStat.textContent = `${solvedCount} / ${total} Solved (${pct}%)`;
    els.reviseStat.textContent = `${reviseCount} Flagged`;
    els.miniBarFill.style.width = `${pct}%`;
  }

  function matchesFilters(day, q) {
    const { search, type, diff } = state.filters;
    const isSolved = !!state.progress.solved[q.id];
    const isRevise = !!state.progress.revise[q.id];

    if (type === 'dsa' && day.type !== 'dsa') return false;
    if (type === 'design' && day.type !== 'design') return false;
    if (type === 'behavioral' && day.type !== 'behavioral') return false;
    if (type === 'revise' && !isRevise) return false;
    if (type === 'unsolved' && isSolved) return false;

    if (diff !== 'all') {
      if (q.diff !== diff) return false;
    }

    if (search) {
      const hay = `${q.name} ${day.category} week ${day.week} day ${day.day} ${q.diff || ''} ${q.type || ''}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  }

  function renderTree() {
    if (!state.data) return;
    const searching = Boolean(state.filters.search || state.filters.type !== 'all' || state.filters.diff !== 'all');
    const frag = document.createDocumentFragment();
    let visibleCount = 0;

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
        wkSolved += day.questions.filter((q) => state.progress.solved[q.id]).length;
        if (matchedQs.length > 0) {
          visibleCount += matchedQs.length;
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
        renderTree();
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
            renderTree();
          });
          dayGroup.appendChild(dayBtn);

          if (isDayOpen) {
            const qList = document.createElement('div');
            qList.className = 'day-questions';
            for (const q of questions) {
              const solved = !!state.progress.solved[q.id];
              const flagged = !!state.progress.revise[q.id];
              const dot = solved ? '✅' : flagged ? '🔖' : '○';
              const badgeCls = q.diff ? `badge-${q.diff}` : `badge-${day.type}`;
              const badgeText = q.diff || (day.type === 'design' ? 'Design' : 'Behav');

              const qBtn = document.createElement('button');
              qBtn.className = `q-item ${state.selectedId === q.id ? 'active' : ''}`;
              qBtn.title = q.name;
              qBtn.innerHTML = `
                <span class="q-item-left">
                  <span class="status-dot">${dot}</span>
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
      els.treeContainer.innerHTML = '<div class="loading-msg" style="padding:16px;color:var(--text-muted)">No matching items found.</div>';
    } else {
      els.treeContainer.appendChild(frag);
    }
  }

  function renderDashboard() {
    state.selectedId = null;
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    els.problemView.classList.add('hidden');
    els.dashboardView.classList.remove('hidden');

    const { totals, weeks } = state.data;
    const solvedIds = Object.keys(state.progress.solved).filter((k) => state.progress.solved[k]);
    const reviseIds = Object.keys(state.progress.revise).filter((k) => state.progress.revise[k]);
    const flaggedItems = state.flatItems.filter((item) => !item.isRevision && state.progress.revise[item.id]);

    els.dashboardView.innerHTML = `
      <div class="hero-card">
        <h1>21-Week DSA & Interview Revision Vault</h1>
        <p>Browse your <code>understanding.md</code> notes alongside <code>bruteforce.java</code>, <code>better.java</code>, and <code>optimised.java</code> solutions directly from your repository.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val">${solvedIds.length} / ${totals.questions}</div>
          <div class="stat-lbl">Questions Solved</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${reviseIds.length}</div>
          <div class="stat-lbl">Flagged for Revision</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${totals.dsaQuestions}</div>
          <div class="stat-lbl">DSA Problems (4 files each)</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${totals.designQuestions + totals.behavioralQuestions}</div>
          <div class="stat-lbl">Design & Behavioral Notes</div>
        </div>
      </div>

      ${flaggedItems.length ? `
        <div class="section-card">
          <h2>🔖 Flagged for Revision (${flaggedItems.length})</h2>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${flaggedItems.map((it) => `<button class="btn" data-jump-id="${escapeHtml(it.id)}">${escapeHtml(it.q.name)}</button>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="section-card">
        <h2>Weekly Progress</h2>
        <div class="week-progress-grid">
          ${weeks.map((wk) => {
            const qs = wk.days.flatMap((d) => d.questions || []);
            const done = qs.filter((q) => state.progress.solved[q.id]).length;
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
      </div>
    `;

    els.dashboardView.querySelectorAll('[data-jump-id]').forEach((btn) => {
      btn.addEventListener('click', () => selectItem(btn.dataset.jumpId));
    });

    els.dashboardView.querySelectorAll('[data-week-jump]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wkNum = Number(btn.dataset.weekJump);
        state.expandedWeeks.add(wkNum);
        const firstId = btn.dataset.firstId;
        if (firstId) selectItem(firstId);
        else renderTree();
      });
    });

    renderTree();
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
      codeBody.innerHTML = `<div class="alert-box" style="margin:14px;">Could not load <code>${escapeHtml(relFile)}</code> (${escapeHtml(err.message)}). Make sure you are serving the site over HTTP (e.g. GitHub Pages or <code>npx serve .</code>).</div>`;
    }
  }

  async function selectItem(id) {
    const idx = state.flatItems.findIndex((it) => it.id === id);
    if (idx === -1) return;
    const item = state.flatItems[idx];

    state.selectedId = id;
    state.expandedWeeks.add(item.week.week);
    state.expandedDays.add(String(item.day.day));
    window.location.hash = encodeURIComponent(id);
    els.sidebar.classList.remove('open');

    renderTree();

    els.dashboardView.classList.add('hidden');
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
    const isSolved = !!state.progress.solved[q.id];
    const isRevise = !!state.progress.revise[q.id];
    const badgeCls = q.diff ? `badge-${q.diff}` : `badge-${day.type}`;
    const badgeText = q.diff === 'E' ? 'Easy' : q.diff === 'M' ? 'Medium' : q.diff === 'H' ? 'Hard' : (q.type || day.type);
    const singlePane = !q.hasJava || state.viewMode !== 'split';

    els.problemView.innerHTML = `
      <div class="problem-header">
        <div>
          <div class="breadcrumb">Week ${week.week} › Day ${day.day} · ${escapeHtml(day.category)}</div>
          <div class="problem-title-row">
            <h1>${escapeHtml(q.name)}</h1>
            <span class="badge ${badgeCls}">${escapeHtml(badgeText)}</span>
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
          <button class="btn btn-solved ${isSolved ? 'active' : ''}" id="toggleSolvedBtn">${isSolved ? '✅ Solved' : 'Mark Solved'}</button>
          <button class="btn btn-revise ${isRevise ? 'active' : ''}" id="toggleReviseBtn">${isRevise ? '🔖 Flagged' : 'Flag Revision'}</button>
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

    document.getElementById('toggleSolvedBtn')?.addEventListener('click', () => {
      state.progress.solved[q.id] = !state.progress.solved[q.id];
      saveProgress();
      selectItem(q.id);
    });

    document.getElementById('toggleReviseBtn')?.addEventListener('click', () => {
      state.progress.revise[q.id] = !state.progress.revise[q.id];
      saveProgress();
      selectItem(q.id);
    });

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

    // Fetch understanding.md
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
      notesBody.innerHTML = `<div class="alert-box">Could not load <code>${escapeHtml(q.path)}/understanding.md</code> (${escapeHtml(err.message)}). Serve this directory over HTTP (e.g. GitHub Pages or <code>npx serve .</code>).</div>`;
    }

    if (q.hasJava) {
      loadJavaTab(item, state.activeTier);
    }
  }

  function buildFlatItems(data) {
    const items = [];
    for (const week of data.weeks) {
      for (const day of week.days) {
        if (day.type === 'revision' || !day.questions.length) {
          items.push({ id: `rev::${day.day}`, isRevision: true, week, day });
        } else {
          for (const q of day.questions) {
            items.push({ id: q.id, isRevision: false, week, day, q });
          }
        }
      }
    }
    return items;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    els.themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function initControls() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);

    els.themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });

    els.sidebarToggle.addEventListener('click', () => {
      els.sidebar.classList.toggle('open');
    });

    els.homeBtn.addEventListener('click', renderDashboard);

    els.searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      renderTree();
    });

    els.typeFilters.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        els.typeFilters.querySelectorAll('.chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.type = btn.dataset.filter;
        renderTree();
      });
    });

    els.diffFilters.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        els.diffFilters.querySelectorAll('.chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.diff = btn.dataset.diff;
        renderTree();
      });
    });

    els.randomBtn.addEventListener('click', () => {
      const pool = state.flatItems.filter((it) => !it.isRevision && (!state.progress.solved[it.id] || state.progress.revise[it.id]));
      const list = pool.length ? pool : state.flatItems.filter((it) => !it.isRevision);
      if (list.length) {
        const pick = list[Math.floor(Math.random() * list.length)];
        selectItem(pick.id);
      }
    });

    els.exportBtn.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state.progress, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dsa-revision-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    els.importInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        state.progress = { solved: parsed.solved || {}, revise: parsed.revise || {} };
        saveProgress();
        if (state.selectedId) selectItem(state.selectedId);
        else renderDashboard();
      } catch (_) {
        alert('Invalid progress JSON file.');
      }
      e.target.value = '';
    });

    window.addEventListener('hashchange', () => {
      const raw = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (raw && state.flatItems.some((it) => it.id === raw)) {
        selectItem(raw);
      } else if (!raw) {
        renderDashboard();
      }
    });
  }

  async function boot() {
    initControls();
    try {
      const res = await fetch(`./roadmap-index.json?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.data = await res.json();
      state.flatItems = buildFlatItems(state.data);
      updateStatsBar();

      const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (hashId && state.flatItems.some((it) => it.id === hashId)) {
        selectItem(hashId);
      } else {
        renderDashboard();
      }
    } catch (err) {
      els.treeContainer.innerHTML = `<div class="alert-box" style="margin:8px;">Failed to load <code>roadmap-index.json</code> (${escapeHtml(err.message)}).<br><br>If you opened <code>index.html</code> via <code>file://</code>, serve the folder over HTTP (<code>npx serve .</code> or GitHub Pages).</div>`;
    }
  }

  boot();
})();

