(() => {
  const THEME_KEY = 'dsa_revision_vault_theme';
  const CONTEST_JOINED_KEY = 'dsa_contest_tracker_joined';
  const LC_API_BASE = 'https://alfa-leetcode-api.onrender.com';

  function loadJoinedContests() {
    try {
      const raw = localStorage.getItem(CONTEST_JOINED_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  const krokiCache = new Map();
  const noembedCache = new Map();

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
    mode: 'dashboard', // dashboard | roadmap | concepts | contests
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
    contests: {
      items: /** @type {Array<any>} */ ([]),
      loading: false,
      fetchedAt: /** @type {number | null} */ (null),
      apiStatus: { leetcode: 'idle', codechef: 'idle' },
      filter: 'all', // all | leetcode | codechef
      joinedIds: new Set(loadJoinedContests())
    },
    contestTimerId: /** @type {number | null} */ (null),
    lc: {
      potd: /** @type {any} */ (null),
      potdStatus: 'idle' // idle | loading | ready | error
    },
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
    contestsCount: document.getElementById('contestsCount'),
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
    contestView: document.getElementById('contestView'),
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

  const KROKI_LANGS = new Set([
    'mermaid', 'plantuml', 'c4plantuml', 'd2', 'graphviz', 'dot', 'excalidraw', 'erd', 'seqdiag'
  ]);

  function toBase64Utf8(str) {
    try {
      const bytes = new TextEncoder().encode(str);
      let bin = '';
      for (const b of bytes) bin += String.fromCharCode(b);
      return btoa(bin);
    } catch (_) {
      return '';
    }
  }

  function fromBase64Utf8(b64) {
    try {
      const bin = atob(b64);
      const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch (_) {
      return '';
    }
  }

  /**
   * Dependency-free Markdown renderer supporting headings, lists, code blocks, Kroki diagrams, links, and tables.
   */
  function renderMarkdown(md) {
    const cleaned = md.replace(/<!--[\s\S]*?-->/g, '').trim();
    const codeBlocks = [];
    const withPlaceholders = cleaned.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, body) => {
      const idx = codeBlocks.length;
      const lower = (lang || '').toLowerCase();
      const trimmed = body.trimEnd();
      let html;
      if (lower === 'java') {
        html = `<pre><code>${highlightJava(trimmed)}</code></pre>`;
      } else if (KROKI_LANGS.has(lower)) {
        const krokiLang = lower === 'dot' ? 'graphviz' : lower;
        const encoded = toBase64Utf8(trimmed);
        html = `
          <div class="kroki-card">
            <div class="kroki-head">
              <span>📐 <strong>${escapeHtml(krokiLang.toUpperCase())}</strong> Diagram (Kroki)</span>
              <span class="badge badge-b">Architecture</span>
            </div>
            <div class="kroki-img-wrap" data-kroki-lang="${escapeHtml(krokiLang)}" data-kroki-src="${escapeHtml(encoded)}">
              <span style="color:#525252;font-size:12px;">Rendering ${escapeHtml(krokiLang)} diagram via Kroki...</span>
            </div>
            <details class="kroki-details">
              <summary>View Diagram Source</summary>
              <pre><code>${escapeHtml(trimmed)}</code></pre>
            </details>
          </div>
        `;
      } else {
        html = `<pre><code>${escapeHtml(trimmed)}</code></pre>`;
      }
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
    const { concepts } = state.data.totals;
    if (els.conceptsCount) els.conceptsCount.textContent = String(concepts || 0);
  }

  function setModeUI(mode) {
    state.mode = mode;
    els.modeButtons.forEach((b) => {
      if (b instanceof HTMLElement) {
        b.classList.toggle('active', b.dataset.mode === mode);
      }
    });

    if (mode !== 'contests' && state.contestTimerId !== null) {
      clearInterval(state.contestTimerId);
      state.contestTimerId = null;
    }

    const isFullWidth = mode === 'dashboard' || mode === 'contests';
    const isConcepts = mode === 'concepts';

    els.sidebar?.classList.toggle('hidden', isFullWidth);
    els.sidebarToggle?.classList.toggle('hidden', isFullWidth);
    els.roadmapControls?.classList.toggle('hidden', isConcepts);
    els.conceptsControls?.classList.toggle('hidden', !isConcepts);

    if (!isFullWidth && state.data) {
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

  function formatShortHmDate(isoStr, isToday) {
    if (isToday) return 'Today';
    const [y, m, d] = isoStr.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
  }

  function renderHeatmap(solvedByDate, selectedDate) {
    const today = getTodayIsoLocal();
    const totalDays = 10;
    const startDateIso = addDaysIso(today, -(totalDays - 1));

    const cells = [];
    for (let i = 0; i < totalDays; i++) {
      const iso = addDaysIso(startDateIso, i);
      const count = (solvedByDate[iso] || []).length;
      let lvl = '';
      if (count >= 6) lvl = 'hm-4';
      else if (count >= 4) lvl = 'hm-3';
      else if (count >= 2) lvl = 'hm-2';
      else if (count >= 1) lvl = 'hm-1';

      const selectedCls = selectedDate === iso ? 'hm-selected' : '';
      const shortLbl = formatShortHmDate(iso, iso === today);
      const title = `${iso}: ${count} question${count === 1 ? '' : 's'} solved`;

      cells.push(
        `<button class="hm-day-box ${lvl} ${selectedCls}" data-hm-date="${iso}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}">
          <span class="hm-day-num">${count}</span>
          <span class="hm-day-date">${escapeHtml(shortLbl)}</span>
        </button>`
      );
    }

    return `
      <div class="heatmap-10-grid">${cells.join('')}</div>
      <div class="heatmap-footer">
        <span>Last 10 days (${startDateIso} → ${today}) · Click any day to inspect</span>
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
    /** @type {Array<{ key: string, label: string, color: string, dimCls: string, litCls: string, items: Array<any> }>} */
    const groups = [
      { key: 'E', label: 'Easy', color: 'var(--green)', dimCls: 'dim-easy', litCls: 'lit-easy', items: [] },
      { key: 'M', label: 'Med', color: 'var(--yellow)', dimCls: 'dim-medium', litCls: 'lit-medium', items: [] },
      { key: 'H', label: 'Hard', color: 'var(--red)', dimCls: 'dim-hard', litCls: 'lit-hard', items: [] },
      { key: 'design', label: 'Design', color: 'var(--blue)', dimCls: 'dim-design', litCls: 'lit-design', items: [] },
      { key: 'behavioral', label: 'Behav', color: '#93c5fd', dimCls: 'dim-behavioral', litCls: 'lit-behavioral', items: [] }
    ];
    const groupByKey = new Map(groups.map((g) => [g.key, g]));

    for (const it of state.flatItems) {
      if (it.isRevision) continue;
      if (it.day.type === 'dsa') {
        const g = groupByKey.get(it.q.diff || 'E');
        if (g) g.items.push(it);
      } else {
        const g = groupByKey.get(it.day.type);
        if (g) g.items.push(it);
      }
    }

    let totalQs = 0;
    let totalSolvedQs = 0;
    const allCells = [];
    const legendHtml = groups.map((g) => {
      const done = g.items.filter((it) => it.q.status === 'solved').length;
      totalQs += g.items.length;
      totalSolvedQs += done;

      for (const it of g.items) {
        const isDone = it.q.status === 'solved';
        const statusTxt = isDone
          ? `Solved${it.q.solvedAt ? ` ${it.q.solvedAt}` : ''}`
          : it.q.hasNotes
            ? 'Notes added'
            : 'Pending';
        const cls = isDone ? g.litCls : it.q.hasNotes ? 'lit-partial' : g.dimCls;
        allCells.push(
          `<button class="p-cell ${cls}" data-jump-id="${escapeHtml(it.id)}" title="${escapeHtml(`${it.q.name} [${g.label} · Day ${it.day.day} · ${statusTxt}]`)}"></button>`
        );
      }

      return `
        <span class="legend-item">
          <span class="legend-dot" style="background:${g.color}"></span>
          <span>${escapeHtml(g.label)} <strong>${done}/${g.items.length}</strong></span>
        </span>
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
        <div class="section-header" style="margin-bottom:8px;">
          <h2>Progress Matrix <span class="badge ${totalSolvedQs ? 'badge-g' : 'badge-grey'}">${totalSolvedQs}/${totalQs}</span></h2>
          <div class="matrix-legend">${legendHtml}</div>
        </div>
        <div class="matrix-sections">
          <div class="matrix-box">
            <div class="block-grid">${allCells.join('')}</div>
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
        <div class="section-header" style="margin-bottom:6px;">
          <h2 style="font-size:14.5px;">${escapeHtml(title)} <span class="badge ${items.length ? 'badge-g' : 'badge-grey'}">${items.length}</span></h2>
          <code style="font-size:11px;color:var(--text-muted);">${escapeHtml(dateStr)}</code>
        </div>
        ${completedDaysToday.size ? `<div style="margin-bottom:6px;display:flex;flex-wrap:wrap;gap:4px;">${Array.from(completedDaysToday).map((d) => `<span class="badge badge-g">✓ ${escapeHtml(d)} Done</span>`).join('')}</div>` : ''}
        ${items.length === 0 ? `
          <div class="empty-hint" style="padding:10px;font-size:12px;">${escapeHtml(emptyText)}</div>
        ` : `
          <div class="target-grid">
            ${items.map((it) => {
              const badgeCls = it.q.diff ? `badge-${it.q.diff}` : `badge-${it.day.type}`;
              const badgeTxt = it.q.diff || it.day.type;
              return `
                <button class="target-item compact is-complete" data-jump-id="${escapeHtml(it.id)}">
                  <span class="target-item-left">
                    <span class="dot-g">✓</span>
                    <span class="target-item-title">${escapeHtml(it.q.name)}</span>
                  </span>
                  <span class="target-item-meta">
                    <span class="target-item-sub">D${escapeHtml(it.day.day)}</span>
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

  async function fetchLeetCodePotd() {
    if (state.lc.potdStatus === 'loading') return;
    state.lc.potdStatus = 'loading';
    if (state.mode === 'dashboard') renderDashboard();

    const urls = [`${LC_API_BASE}/daily`, `${LC_API_BASE}/dailyProblem`];
    for (const url of urls) {
      try {
        const json = await fetchJsonWithTimeout(url, 6500);
        const qNode = json?.question || json;
        const title = qNode?.title || json?.questionTitle || '';
        const rawLink = json?.link || json?.questionLink || (qNode?.titleSlug ? `/problems/${qNode.titleSlug}/` : '');
        const fullUrl = rawLink.startsWith('http')
          ? rawLink
          : `https://leetcode.com${rawLink.startsWith('/') ? '' : '/'}${rawLink}`;
        const rawDiff = String(qNode?.difficulty || json?.difficulty || 'Medium');
        const diff = rawDiff[0]?.toUpperCase() || 'M';
        const tags = Array.isArray(qNode?.topicTags) ? qNode.topicTags.map((t) => t.name).slice(0, 3) : [];
        if (title) {
          state.lc.potd = {
            date: json?.date || getTodayIsoLocal(),
            title,
            url: fullUrl,
            diff,
            diffLabel: rawDiff,
            tags
          };
          state.lc.potdStatus = 'ready';
          if (state.mode === 'dashboard') renderDashboard();
          return;
        }
      } catch (_) {}
    }

    state.lc.potdStatus = 'error';
    if (state.mode === 'dashboard') renderDashboard();
  }

  function buildXShareText(targetEntry, todayIds) {
    const solvedItems = (todayIds || [])
      .map((id) => state.itemById.get(id))
      .filter((it) => it && !it.isRevision && it.q);

    const uniqueDays = [];
    for (const it of solvedItems) {
      const lbl = `Day ${it.day.day}`;
      if (!uniqueDays.includes(lbl)) uniqueDays.push(lbl);
    }
    const dayLabel = uniqueDays.length ? uniqueDays.join(' & ') : `Day ${targetEntry.day.day}`;
    const count = solvedItems.length;
    const footer = '#150DaysOfDSA #DSA #LeetCode';
    const header = `${dayLabel} — 150 Days Challenge\n\nSolved Today: ${count} question${count === 1 ? '' : 's'}`;

    if (count === 0) {
      return `${header}\nQuestions: None solved today yet\n\n${footer}`;
    }

    const names = solvedItems.map((it) => it.q.name);
    const maxLen = 275;
    const lines = [];
    for (let i = 0; i < names.length; i++) {
      const candidateLine = `• ${names[i]}`;
      const remaining = names.length - i - 1;
      const moreSuffix = remaining > 0 ? `\n+${remaining} more` : '';
      const candidate = `${header}\n${[...lines, candidateLine].join('\n')}${moreSuffix}\n\n${footer}`;
      if (candidate.length > maxLen && lines.length > 0) {
        lines.push(`+${names.length - i} more`);
        break;
      }
      lines.push(candidateLine);
    }

    return `${header}\n${lines.join('\n')}\n\n${footer}`;
  }

  function renderIntegrationsRow(targetEntry, todayIds) {
    const potd = state.lc.potd;
    const potdHtml = state.lc.potdStatus === 'loading'
      ? '<div class="empty-hint" style="padding:10px;font-size:12px;">Fetching LeetCode Daily Problem...</div>'
      : potd
        ? `
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
            <span class="badge badge-${escapeHtml(potd.diff)}">${escapeHtml(potd.diffLabel)}</span>
            <code style="font-size:11px;color:var(--text-muted);">${escapeHtml(potd.date)}</code>
          </div>
          <div style="font-weight:600;font-size:13.5px;margin-bottom:6px;">${escapeHtml(potd.title)}</div>
          ${potd.tags?.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">${potd.tags.map((t) => `<span class="badge badge-grey">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
          <a class="btn btn-primary" href="${escapeHtml(potd.url)}" target="_blank" rel="noopener noreferrer">Solve POTD ↗</a>
        `
        : `
          <div class="empty-hint" style="padding:10px;font-size:12px;margin-bottom:8px;">Could not load live POTD right now.</div>
          <a class="btn" href="https://leetcode.com/problemset/" target="_blank" rel="noopener noreferrer">Open LeetCode ↗</a>
        `;

    const shareText = buildXShareText(targetEntry, todayIds);
    const xIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

    return `
      <div class="integrations-grid">
        <section class="section-card">
          <div class="section-header" style="margin-bottom:8px;">
            <h2 style="font-size:14.5px;">🟡 LeetCode POTD</h2>
            <button class="btn" id="lcRefreshPotdBtn" ${state.lc.potdStatus === 'loading' ? 'disabled' : ''}>↻</button>
          </div>
          ${potdHtml}
        </section>

        <section class="section-card">
          <div class="section-header" style="margin-bottom:8px;">
            <h2 style="font-size:14.5px;">𝕏 Share Progress on X</h2>
            <div style="display:flex;gap:6px;">
              <button class="btn" id="copyXPostBtn">Copy</button>
              <a class="btn btn-primary" href="${escapeHtml(xIntentUrl)}" target="_blank" rel="noopener noreferrer">Share on X ↗</a>
            </div>
          </div>
          <pre class="x-post-preview" id="xPostPreview">${escapeHtml(shareText)}</pre>
        </section>
      </div>
    `;
  }

  async function hydrateKrokiDiagrams(container) {
    const nodes = container.querySelectorAll('[data-kroki-lang][data-kroki-src]');
    for (const el of nodes) {
      if (!(el instanceof HTMLElement)) continue;
      const lang = el.dataset.krokiLang || 'mermaid';
      const src = fromBase64Utf8(el.dataset.krokiSrc || '');
      if (!src) continue;

      const cacheKey = `${lang}::${src}`;
      let svgText = krokiCache.get(cacheKey);
      if (!svgText) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 7000);
          const res = await fetch(`https://kroki.io/${encodeURIComponent(lang)}/svg`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            body: src,
            signal: controller.signal
          });
          clearTimeout(timer);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          svgText = await res.text();
          krokiCache.set(cacheKey, svgText);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          el.innerHTML = `<span style="color:#ef4444;font-size:12px;">Could not render Kroki diagram (${escapeHtml(msg)}). Expand source below.</span>`;
          continue;
        }
      }

      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      el.innerHTML = `<img src="${dataUrl}" alt="${escapeHtml(lang)} diagram rendered by Kroki" />`;
    }
  }

  async function hydrateNoembedLinks(container) {
    const links = Array.from(container.querySelectorAll('a[href^="http"]')).filter((a) => {
      const href = a.getAttribute('href') || '';
      return /(youtube\.com\/watch|youtu\.be\/|youtube\.com\/shorts\/|vimeo\.com\/\d+|codepen\.io\/.+\/pen\/)/i.test(href);
    });

    const seen = new Set();
    let count = 0;
    for (const a of links) {
      if (count >= 6) break;
      const href = a.getAttribute('href') || '';
      if (!href || seen.has(href)) continue;
      seen.add(href);
      count++;

      let data = noembedCache.get(href);
      if (data === undefined) {
        try {
          data = await fetchJsonWithTimeout(`https://noembed.com/embed?url=${encodeURIComponent(href)}`, 4500);
          if (!data || data.error || !data.title) data = null;
          noembedCache.set(href, data);
        } catch (_) {
          noembedCache.set(href, null);
          data = null;
        }
      }
      if (!data) continue;

      const card = document.createElement('a');
      card.className = 'oembed-card';
      card.href = href;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.innerHTML = `
        ${data.thumbnail_url ? `<img class="oembed-thumb" src="${escapeHtml(data.thumbnail_url)}" alt="" loading="lazy" />` : ''}
        <span class="oembed-meta">
          <span class="oembed-title">${escapeHtml(data.title)}</span>
          <span class="oembed-sub">${escapeHtml(data.author_name || data.provider_name || 'Video / Resource')} ↗</span>
        </span>
      `;
      const anchorHost = a.closest('li, p') || a;
      anchorHost.insertAdjacentElement('afterend', card);
    }
  }

  function hydrateMarkdownExtras(container) {
    if (!container) return;
    hydrateKrokiDiagrams(container);
    hydrateNoembedLinks(container);
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
    els.contestView?.classList.add('hidden');
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

      <div class="bento-grid">
        <div class="bento-col">
          ${renderProgressMatrix(flatDays)}
        </div>

        <div class="bento-col">
          <section class="section-card ${targetEntry.day.completed ? 'is-complete' : ''}">
            <div class="section-header" style="margin-bottom:6px;">
              <h2>
                Today's Target — Day ${escapeHtml(targetEntry.day.day)}
                ${targetEntry.day.completed ? '<span class="badge badge-g">✓ Done</span>' : paceBadge}
              </h2>
              <div style="display:flex;gap:5px;align-items:center;">
                <button class="btn" id="targetPrevBtn" ${targetIdx <= 0 ? 'disabled' : ''}>←</button>
                <button class="btn" id="targetTodayBtn">Next Pending</button>
                <button class="btn" id="targetNextBtn" ${targetIdx >= flatDays.length - 1 ? 'disabled' : ''}>→</button>
              </div>
            </div>

            <div class="section-sub" style="margin-bottom:8px;">
              Week ${targetEntry.week.week} ${targetEntry.week.completed ? '<span class="badge badge-g">✓ Week Done</span>' : ''}
              · <strong>${escapeHtml(targetEntry.day.category)}</strong>
              ${targetTotal ? ` · ${targetDone}/${targetTotal} (${targetPct}%)` : ''}
            </div>

            <div class="day-progress-bar" style="margin-bottom:9px;">
              <div class="day-progress-fill" style="width:${targetPct}%"></div>
            </div>

            ${targetEntry.day.type === 'revision' || targetQs.length === 0 ? `
              <div class="target-grid">
                <button class="target-item compact ${targetEntry.day.completed ? 'is-complete' : ''}" data-jump-id="rev::${escapeHtml(targetEntry.day.day)}">
                  <span class="target-item-left">
                    <span>${targetEntry.day.completed ? '✓' : '↻'}</span>
                    <span class="target-item-title">${escapeHtml(targetEntry.day.title || targetEntry.day.category)}</span>
                  </span>
                  <span class="badge badge-revision">Open Revision</span>
                </button>
              </div>
            ` : `
              <div class="target-grid">
                ${targetQs.map((q) => {
                  const badgeCls = q.diff ? `badge-${q.diff}` : `badge-${targetEntry.day.type}`;
                  const badgeTxt = q.diff || targetEntry.day.type;
                  const isDone = q.status === 'solved';
                  return `
                    <button class="target-item compact ${isDone ? 'is-complete' : ''}" data-jump-id="${escapeHtml(q.id)}">
                      <span class="target-item-left">
                        ${getStatusIndicator(q)}
                        <span class="target-item-title">${escapeHtml(q.name)}</span>
                      </span>
                      <span class="target-item-meta">
                        ${q.solvedAt ? `<span class="target-item-sub">${escapeHtml(q.solvedAt)}</span>` : ''}
                        <span class="badge ${badgeCls}">${escapeHtml(badgeTxt)}</span>
                      </span>
                    </button>
                  `;
                }).join('')}
              </div>
            `}
          </section>

          <section class="section-card">
            <div class="section-header" style="margin-bottom:8px;">
              <h2>Solve Heatmap <span class="badge badge-grey">Last 10 Days</span></h2>
              ${state.selectedHeatmapDate ? '<button class="btn" id="clearHeatmapBtn">Reset to Today</button>' : ''}
            </div>
            ${renderHeatmap(solvedByDate, state.selectedHeatmapDate)}
          </section>
        </div>
      </div>

      <div class="dashboard-grid-2 dashboard-bottom-row">
        ${renderSolvedListCard(
          state.selectedHeatmapDate ? `Solved (${activeLeftDate})` : 'Solved Today',
          activeLeftDate,
          leftIds,
          state.selectedHeatmapDate
            ? 'None solved on this date.'
            : 'No problems solved today yet.'
        )}

        ${renderSolvedListCard(
          'Solved Yesterday',
          yesterdayStr,
          yesterdayIds,
          'None solved yesterday.'
        )}
      </div>

      ${renderIntegrationsRow(targetEntry, solvedByDate[todayStr] || [])}
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

    document.getElementById('lcRefreshPotdBtn')?.addEventListener('click', () => {
      fetchLeetCodePotd();
    });

    document.getElementById('copyXPostBtn')?.addEventListener('click', async () => {
      const btn = document.getElementById('copyXPostBtn');
      const preview = document.getElementById('xPostPreview');
      if (!preview) return;
      try {
        await navigator.clipboard.writeText(preview.textContent || '');
        if (btn) {
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 1200);
        }
      } catch (_) {}
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
    els.contestView?.classList.add('hidden');
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
      hydrateMarkdownExtras(conceptBody);
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
    els.contestView?.classList.add('hidden');
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
        hydrateMarkdownExtras(revBody);
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
        hydrateMarkdownExtras(notesBody);
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

  const CONTEST_SCHEDULES = [
    {
      platform: 'leetcode',
      cadence: 'weekly',
      anchorNum: 400,
      anchorMs: Date.UTC(2024, 5, 2, 2, 30, 0), // Sunday 08:00 AM IST
      periodMs: 7 * 86400000,
      durationMin: 90,
      buildTitle: (num) => `Weekly Contest ${num}`,
      buildUrl: (num) => `https://leetcode.com/contest/weekly-contest-${num}/`,
      matchTitle: (title) => /\bweekly\s+contest\b/i.test(title) && !/\bbiweekly\b/i.test(title),
      ruleLabel: 'Every Sunday · 8:00 AM IST (02:30 UTC) · 90m'
    },
    {
      platform: 'leetcode',
      cadence: 'biweekly',
      anchorNum: 130,
      anchorMs: Date.UTC(2024, 4, 11, 14, 30, 0), // Alternate Saturday 08:00 PM IST
      periodMs: 14 * 86400000,
      durationMin: 90,
      buildTitle: (num) => `Biweekly Contest ${num}`,
      buildUrl: (num) => `https://leetcode.com/contest/biweekly-contest-${num}/`,
      matchTitle: (title) => /\bbiweekly\s+contest\b/i.test(title),
      ruleLabel: 'Alternate Saturday · 8:00 PM IST (14:30 UTC) · 90m'
    },
    {
      platform: 'codechef',
      cadence: 'starters',
      anchorNum: 150,
      anchorMs: Date.UTC(2024, 8, 4, 14, 30, 0), // Wednesday 08:00 PM IST
      periodMs: 7 * 86400000,
      durationMin: 120,
      buildTitle: (num) => `CodeChef Starters ${num}`,
      buildUrl: (num) => `https://www.codechef.com/START${num}`,
      matchTitle: (title) => /\bstarter/i.test(title),
      ruleLabel: 'Every Wednesday · 8:00 PM IST (14:30 UTC) · 120m'
    }
  ];

  function saveJoinedContests() {
    try {
      localStorage.setItem(CONTEST_JOINED_KEY, JSON.stringify(Array.from(state.contests.joinedIds)));
    } catch (_) {}
  }

  async function fetchJsonWithTimeout(url, timeoutMs = 5000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function normalizeContestItem(raw, fallbackPlatform) {
    if (!raw || typeof raw !== 'object') return null;
    const title = String(raw.title || raw.name || raw.contest_name || '').trim();
    const rawPlatform = String(raw.platform || raw.site || fallbackPlatform || '').toLowerCase();
    const platform = rawPlatform.includes('leetcode')
      ? 'leetcode'
      : rawPlatform.includes('codechef')
        ? 'codechef'
        : fallbackPlatform;
    if (!title || (platform !== 'leetcode' && platform !== 'codechef')) return null;

    const startRaw = raw.startTime || raw.start_time || raw.start;
    const startMs = typeof startRaw === 'number'
      ? (startRaw < 1e12 ? startRaw * 1000 : startRaw)
      : Date.parse(String(startRaw || ''));
    if (!Number.isFinite(startMs)) return null;

    const endRaw = raw.endTime || raw.end_time || raw.end;
    let endMs = endRaw
      ? (typeof endRaw === 'number' ? (endRaw < 1e12 ? endRaw * 1000 : endRaw) : Date.parse(String(endRaw)))
      : NaN;

    if (!Number.isFinite(endMs) || endMs <= startMs) {
      const rawDur = Number(raw.duration || raw.contest_duration || 0);
      let durationMs = 90 * 60000;
      if (Number.isFinite(rawDur) && rawDur > 0) {
        if (rawDur > 86400) durationMs = rawDur;           // milliseconds
        else if (rawDur >= 600) durationMs = rawDur * 1000; // seconds
        else durationMs = rawDur * 60000;                  // minutes
      } else if (platform === 'codechef') {
        durationMs = 120 * 60000;
      }
      endMs = startMs + durationMs;
    }

    const url = String(
      raw.url ||
      (platform === 'leetcode' ? 'https://leetcode.com/contest/' : 'https://www.codechef.com/contests')
    );

    return {
      id: `${platform}::${startMs}`,
      platform,
      title,
      url,
      startMs,
      endMs,
      durationMin: Math.round((endMs - startMs) / 60000),
      source: 'api'
    };
  }

  async function fetchPlatformContestsFromApi(platform) {
    const candidates = [
      {
        url: `https://contest-hive.vercel.app/api/${platform}`,
        extract: (json) => (json && Array.isArray(json.data) ? json.data : [])
      },
      {
        url: 'https://competeapi.vercel.app/contests/upcoming/',
        extract: (json) => (Array.isArray(json) ? json : [])
      }
    ];

    const nowMs = Date.now();
    for (const src of candidates) {
      try {
        const json = await fetchJsonWithTimeout(src.url, 5000);
        const list = src.extract(json)
          .map((item) => normalizeContestItem(item, platform))
          .filter((item) => item && item.platform === platform && item.endMs > nowMs);
        if (list.length > 0) {
          return { status: 'api', items: list };
        }
      } catch (_) {
        // Try next public API candidate or fall back to recurring schedule
      }
    }
    return { status: 'fallback', items: [] };
  }

  function parseContestNumber(title) {
    const m = String(title || '').match(/(\d{2,4})/);
    return m ? Number(m[1]) : null;
  }

  function buildRecurringContests(nowMs, horizonDays, apiItems) {
    const horizonEndMs = nowMs + horizonDays * 86400000;
    const generated = [];

    for (const sched of CONTEST_SCHEDULES) {
      const durationMs = sched.durationMin * 60000;
      const firstK = Math.floor((nowMs - sched.anchorMs - durationMs) / sched.periodMs) + 1;

      // If an API item matches this recurring cadence, calibrate numbering offset from it
      let numOffset = 0;
      for (const apiItem of apiItems) {
        if (apiItem.platform !== sched.platform || !sched.matchTitle(apiItem.title)) continue;
        const apiNum = parseContestNumber(apiItem.title);
        if (apiNum === null) continue;
        const nearestK = Math.round((apiItem.startMs - sched.anchorMs) / sched.periodMs);
        const expectedStart = sched.anchorMs + nearestK * sched.periodMs;
        if (Math.abs(apiItem.startMs - expectedStart) <= 3 * 3600000) {
          numOffset = apiNum - (sched.anchorNum + nearestK);
          break;
        }
      }

      for (let k = firstK; ; k++) {
        const startMs = sched.anchorMs + k * sched.periodMs;
        if (startMs > horizonEndMs) break;
        const endMs = startMs + durationMs;
        if (endMs <= nowMs) continue;

        const hasApiMatch = apiItems.some(
          (apiItem) =>
            apiItem.platform === sched.platform &&
            Math.abs(apiItem.startMs - startMs) <= 3 * 3600000
        );
        if (hasApiMatch) continue;

        const num = sched.anchorNum + k + numOffset;
        generated.push({
          id: `${sched.platform}::${startMs}`,
          platform: sched.platform,
          title: sched.buildTitle(num),
          url: sched.buildUrl(num),
          startMs,
          endMs,
          durationMin: sched.durationMin,
          source: 'schedule'
        });
      }
    }

    return generated;
  }

  const CONTEST_HORIZON_DAYS = 10;

  function mergeContests(apiItems, nowMs) {
    const horizonEndMs = nowMs + CONTEST_HORIZON_DAYS * 86400000;
    const validApi = apiItems.filter((it) => it.endMs > nowMs && it.startMs <= horizonEndMs);
    const recurring = buildRecurringContests(nowMs, CONTEST_HORIZON_DAYS, apiItems);
    const merged = [...validApi, ...recurring];
    merged.sort((a, b) => a.startMs - b.startMs);
    return merged;
  }

  function updateContestsPill() {
    if (!els.contestsCount) return;
    const nowMs = Date.now();
    const horizonEndMs = nowMs + CONTEST_HORIZON_DAYS * 86400000;
    const count = state.contests.items.filter((c) => c.endMs > nowMs && c.startMs <= horizonEndMs).length;
    els.contestsCount.textContent = String(count);
  }

  async function refreshContests(force = false) {
    if (state.contests.loading && !force) return;
    const nowMs = Date.now();
    if (!state.contests.items.length) {
      state.contests.items = mergeContests([], nowMs);
      updateContestsPill();
    }

    state.contests.loading = true;
    if (state.mode === 'contests') renderContestTracker();

    const [lcRes, ccRes] = await Promise.all([
      fetchPlatformContestsFromApi('leetcode'),
      fetchPlatformContestsFromApi('codechef')
    ]);

    state.contests.apiStatus = {
      leetcode: lcRes.status,
      codechef: ccRes.status
    };
    const apiItems = [...lcRes.items, ...ccRes.items];
    state.contests.items = mergeContests(apiItems, Date.now());
    state.contests.fetchedAt = Date.now();
    state.contests.loading = false;
    updateContestsPill();

    if (state.mode === 'contests') {
      renderContestTracker();
    }
  }

  function formatDurationLabel(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  }

  function formatCountdown(targetMs, nowMs = Date.now()) {
    const diff = Math.max(0, targetMs - nowMs);
    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const hh = String(hrs).padStart(2, '0');
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    return days > 0 ? `${days}d ${hh}h ${mm}m ${ss}s` : `${hh}h ${mm}m ${ss}s`;
  }

  function formatContestWindowParts(startMs, endMs) {
    const startDt = new Date(startMs);
    const endDt = new Date(endMs);
    const datePart = startDt.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const startTime = startDt.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = endDt.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { datePart, timeRange: `${startTime} – ${endTime}` };
  }

  function renderContestDateTimePills(startMs, endMs) {
    const { datePart, timeRange } = formatContestWindowParts(startMs, endMs);
    return `
      <span class="contest-datetime-row">
        <span class="contest-date-pill">📅 ${escapeHtml(datePart)}</span>
        <span class="contest-time-pill">🕒 ${escapeHtml(timeRange)}</span>
      </span>
    `;
  }

  function buildGoogleCalendarUrl(contest) {
    const fmt = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: contest.title,
      dates: `${fmt(contest.startMs)}/${fmt(contest.endMs)}`,
      details: `Platform: ${contest.platform === 'leetcode' ? 'LeetCode' : 'CodeChef'}\nLink: ${contest.url}`
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function updateContestCountdowns() {
    if (state.mode !== 'contests' || !els.contestView) return;
    const nowMs = Date.now();
    els.contestView.querySelectorAll('[data-countdown-start]').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const startMs = Number(el.dataset.countdownStart || 0);
      const endMs = Number(el.dataset.countdownEnd || 0);
      if (nowMs >= endMs) {
        el.textContent = 'Ended';
      } else if (nowMs >= startMs) {
        el.textContent = `Ends in ${formatCountdown(endMs, nowMs)}`;
      } else {
        el.textContent = formatCountdown(startMs, nowMs);
      }
    });
  }

  function renderContestTracker() {
    if (!els.contestView) return;
    state.selectedId = null;
    state.selectedConceptId = null;
    setModeUI('contests');
    if (window.location.hash !== '#contests') {
      history.replaceState(null, '', '#contests');
    }

    els.dashboardView?.classList.add('hidden');
    els.problemView?.classList.add('hidden');
    els.conceptView?.classList.add('hidden');
    els.contestView.classList.remove('hidden');

    if (!state.contests.items.length && !state.contests.loading) {
      refreshContests(false);
    }

    const nowMs = Date.now();
    const horizonEndMs = nowMs + CONTEST_HORIZON_DAYS * 86400000;
    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
    const allContests = state.contests.items.filter((c) => c.endMs > nowMs && c.startMs <= horizonEndMs);
    const filtered = state.contests.filter === 'all'
      ? allContests
      : allContests.filter((c) => c.platform === state.contests.filter);

    const nextContest = filtered[0] || allContests[0] || null;
    const nextIsLive = Boolean(nextContest && nowMs >= nextContest.startMs && nowMs < nextContest.endMs);
    const nextLc = allContests.find((c) => c.platform === 'leetcode');
    const nextCc = allContests.find((c) => c.platform === 'codechef');

    const { leetcode: lcState, codechef: ccState } = state.contests.apiStatus;
    const sourceBadge = state.contests.loading
      ? '<span class="badge badge-y">⟳ Syncing public APIs...</span>'
      : lcState === 'api' && ccState === 'api'
        ? '<span class="badge badge-g">● Live Public API</span>'
        : lcState === 'api' || ccState === 'api'
          ? '<span class="badge badge-y">◐ Partial Live API + Schedule</span>'
          : '<span class="badge badge-grey">↻ Recurring Schedule Mode</span>';

    const platformTag = (p) =>
      p === 'leetcode'
        ? '<span class="badge badge-lc">LeetCode</span>'
        : '<span class="badge badge-cc">CodeChef</span>';

    const statusTag = (c) => {
      if (nowMs >= c.startMs && nowMs < c.endMs) return '<span class="badge badge-r">● LIVE NOW</span>';
      const hrs = (c.startMs - nowMs) / 3600000;
      if (hrs <= 24) return '<span class="badge badge-y">Within 24h</span>';
      return '';
    };

    els.contestView.innerHTML = `
      <div class="section-card">
        <div class="contest-toolbar">
          <div>
            <h2 style="margin:0;font-size:18px;display:flex;align-items:center;gap:8px;">
              🏆 Contest Tracker ${sourceBadge}
            </h2>
            <div class="section-sub" style="margin:4px 0 0;">
              Tracking upcoming <strong>LeetCode</strong> & <strong>CodeChef</strong> contests · Timezone: <code>${escapeHtml(tzName)}</code>
              ${state.contests.fetchedAt ? ` · Last checked ${escapeHtml(new Date(state.contests.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}` : ''}
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;">
            <button class="chip ${state.contests.filter === 'all' ? 'active' : ''}" data-c-filter="all">All (${allContests.length})</button>
            <button class="chip ${state.contests.filter === 'leetcode' ? 'active' : ''}" data-c-filter="leetcode">LeetCode (${allContests.filter((c) => c.platform === 'leetcode').length})</button>
            <button class="chip ${state.contests.filter === 'codechef' ? 'active' : ''}" data-c-filter="codechef">CodeChef (${allContests.filter((c) => c.platform === 'codechef').length})</button>
            <button class="btn" id="refreshContestsBtn" ${state.contests.loading ? 'disabled' : ''}>↻ Refresh</button>
          </div>
        </div>
      </div>

      <div class="contest-hero">
        <section class="section-card contest-spotlight ${nextIsLive ? 'is-live' : ''}">
          <div class="section-header" style="margin-bottom:8px;">
            <h2>${nextIsLive ? '🔴 Live Contest' : '⚡ Next Contest Up'}</h2>
            ${nextContest ? platformTag(nextContest.platform) : ''}
          </div>
          ${nextContest ? `
            <div style="font-size:18px;font-weight:700;margin-bottom:6px;">
              ${escapeHtml(nextContest.title)} ${statusTag(nextContest)}
            </div>
            <div class="contest-countdown" data-countdown-start="${nextContest.startMs}" data-countdown-end="${nextContest.endMs}">
              ${nextIsLive ? `Ends in ${formatCountdown(nextContest.endMs, nowMs)}` : formatCountdown(nextContest.startMs, nowMs)}
            </div>
            <div style="margin:8px 0 12px;display:flex;flex-wrap:wrap;align-items:center;gap:8px;">
              ${renderContestDateTimePills(nextContest.startMs, nextContest.endMs)}
              <span class="badge badge-grey">⏱ ${escapeHtml(formatDurationLabel(nextContest.durationMin))}</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <a class="btn btn-primary" href="${escapeHtml(nextContest.url)}" target="_blank" rel="noopener noreferrer">Open Contest ↗</a>
              <a class="btn" href="${escapeHtml(buildGoogleCalendarUrl(nextContest))}" target="_blank" rel="noopener noreferrer">📅 Google Calendar</a>
              <button class="btn ${state.contests.joinedIds.has(nextContest.id) ? 'btn-joined' : ''}" data-join-id="${escapeHtml(nextContest.id)}">
                ${state.contests.joinedIds.has(nextContest.id) ? '✓ Participating' : '+ Mark Participating'}
              </button>
            </div>
          ` : '<div class="empty-hint">No upcoming contests found.</div>'}
        </section>

        <section class="section-card">
          <div class="section-header" style="margin-bottom:8px;">
            <h2>🗓️ Fixed Weekly Cadence</h2>
            <span class="badge badge-grey">Auto-Fallback Active</span>
          </div>
          <div class="contest-schedule-list">
            ${CONTEST_SCHEDULES.map((s) => `
              <div class="contest-schedule-row">
                <div>
                  <div style="font-weight:600;display:flex;align-items:center;gap:6px;">
                    ${platformTag(s.platform)}
                    <span>${s.cadence === 'weekly' ? 'Weekly Contest' : s.cadence === 'biweekly' ? 'Biweekly Contest' : 'CodeChef Starters'}</span>
                  </div>
                  <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px;">${escapeHtml(s.ruleLabel)}</div>
                </div>
                <span class="badge ${state.contests.apiStatus[s.platform] === 'api' ? 'badge-g' : 'badge-grey'}">
                  ${state.contests.apiStatus[s.platform] === 'api' ? 'API Synced' : 'Schedule'}
                </span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:8px;font-size:11.5px;color:var(--text-muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
            <span>Next LC: <strong>${nextLc ? escapeHtml(nextLc.title) : '—'}</strong></span>
            <span>Next CC: <strong>${nextCc ? escapeHtml(nextCc.title) : '—'}</strong></span>
          </div>
        </section>
      </div>

      <section class="section-card">
        <div class="section-header">
          <h2>Upcoming Contests (Next ${CONTEST_HORIZON_DAYS} Days)</h2>
          <span class="section-sub" style="margin:0;">${filtered.length} scheduled · ${state.contests.joinedIds.size} marked participating</span>
        </div>

        ${filtered.length === 0 ? `
          <div class="empty-hint">No upcoming contests match this filter in the next ${CONTEST_HORIZON_DAYS} days.</div>
        ` : `
          <div class="contest-list">
            ${filtered.map((c) => {
              const isLive = nowMs >= c.startMs && nowMs < c.endMs;
              const isJoined = state.contests.joinedIds.has(c.id);
              return `
                <div class="contest-card ${isLive ? 'is-live' : ''} ${isJoined ? 'is-joined' : ''}">
                  <div class="contest-card-main">
                    <div class="contest-card-title">
                      ${platformTag(c.platform)}
                      <span>${escapeHtml(c.title)}</span>
                      ${statusTag(c)}
                      <span class="badge ${c.source === 'api' ? 'badge-g' : 'badge-grey'}">${c.source === 'api' ? 'Live API' : 'Schedule'}</span>
                    </div>
                    <div class="contest-card-meta">
                      ${renderContestDateTimePills(c.startMs, c.endMs)}
                      <span>⏱ ${escapeHtml(formatDurationLabel(c.durationMin))}</span>
                      <span>⏳ <strong class="contest-countdown-sm" data-countdown-start="${c.startMs}" data-countdown-end="${c.endMs}">${isLive ? `Ends in ${formatCountdown(c.endMs, nowMs)}` : formatCountdown(c.startMs, nowMs)}</strong></span>
                    </div>
                  </div>
                  <div class="contest-card-right">
                    <button class="btn ${isJoined ? 'btn-joined' : ''}" data-join-id="${escapeHtml(c.id)}">
                      ${isJoined ? '✓ Participating' : 'Participate'}
                    </button>
                    <a class="btn" href="${escapeHtml(buildGoogleCalendarUrl(c))}" target="_blank" rel="noopener noreferrer" title="Add to Google Calendar">📅 Cal</a>
                    <a class="btn btn-primary" href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer">Open ↗</a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </section>
    `;

    els.contestView.querySelectorAll('[data-c-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!(btn instanceof HTMLElement) || !btn.dataset.cFilter) return;
        state.contests.filter = btn.dataset.cFilter;
        renderContestTracker();
      });
    });

    els.contestView.querySelectorAll('[data-join-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!(btn instanceof HTMLElement) || !btn.dataset.joinId) return;
        const id = btn.dataset.joinId;
        if (state.contests.joinedIds.has(id)) state.contests.joinedIds.delete(id);
        else state.contests.joinedIds.add(id);
        saveJoinedContests();
        renderContestTracker();
      });
    });

    document.getElementById('refreshContestsBtn')?.addEventListener('click', () => {
      refreshContests(true);
    });

    if (state.contestTimerId !== null) clearInterval(state.contestTimerId);
    state.contestTimerId = window.setInterval(updateContestCountdowns, 1000);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    if (els.themeBtn) {
      els.themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  function routeFromHash() {
    let raw = '';
    try {
      raw = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    } catch (_) {
      raw = '';
    }
    if (raw === 'contests') {
      renderContestTracker();
      return;
    }
    if (!state.data) return;
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
      if (state.mode === 'dashboard') renderDashboard();
    });

    els.sidebarToggle?.addEventListener('click', () => {
      els.sidebar?.classList.toggle('open');
    });

    els.homeBtn?.addEventListener('click', () => renderDashboard());

    els.modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!(btn instanceof HTMLElement)) return;
        const mode = btn.dataset.mode;
        if (mode === 'contests') {
          renderContestTracker();
          return;
        }
        if (!state.data) return;
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

    window.addEventListener('hashchange', routeFromHash);
  }

  async function boot() {
    setModeUI('dashboard');
    initControls();
    refreshContests(false);
    fetchLeetCodePotd();
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
