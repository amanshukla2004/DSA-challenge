const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'daily_data.js');
const CONCEPTS_DIR = path.join(ROOT_DIR, 'Concepts');
const TRACKER_FILE = path.join(ROOT_DIR, 'daily-tracker.json');
const INITIAL_SCAFFOLD_COMMIT = '6fefd623855cce9b7554ac13123ce156de254069';

/**
 * Load dailyRoadmap array from daily_data.js without needing module.exports in daily_data.js.
 */
function loadRoadmap() {
  const code = fs.readFileSync(DATA_FILE, 'utf8');
  return new Function(`${code}; return dailyRoadmap;`)();
}

/**
 * Convert any string into a clean, URL-safe, Windows-safe folder segment.
 */
function sanitizeSegment(input, maxLen = 72) {
  let s = String(input)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[<>:"/\\|?*{}]/g, ' ')
    .replace(/['`,.!()[\]]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (s.length > maxLen) {
    const cut = s.slice(0, maxLen);
    const lastHyphen = cut.lastIndexOf('-');
    s = (lastHyphen > 20 ? cut.slice(0, lastHyphen) : cut).replace(/-+$/g, '');
  }

  return s || 'item';
}

function formatWeekFolder(weekNum) {
  return `Week-${String(weekNum).padStart(2, '0')}`;
}

function formatDayFolder(dayEntry) {
  const rawDay = String(dayEntry.day).trim();
  const dayPart = /^\d+$/.test(rawDay)
    ? `Day-${rawDay.padStart(3, '0')}`
    : `Day-${sanitizeSegment(rawDay, 20)}`;
  const catPart = sanitizeSegment(dayEntry.category, 48);
  return `${dayPart}_${catPart}`;
}

function writeIfMissing(filePath, content, stats) {
  if (fs.existsSync(filePath)) {
    stats.skipped++;
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  stats.created++;
  return true;
}

function normalizeText(str) {
  return String(str).replace(/\r\n/g, '\n').trim();
}

function buildDsaUnderstandingTemplate(dayEntry, q) {
  const diffLabel = q.diff === 'E' ? 'Easy' : q.diff === 'M' ? 'Medium' : q.diff === 'H' ? 'Hard' : (q.diff || 'DSA');
  return `# ${q.name}

- **Question Name:** ${q.name}
- **Question Number:** TBD
- **Difficulty:** ${diffLabel} (${q.diff || 'DSA'})
- **Week / Day / Category:** Week ${dayEntry.week} · Day ${dayEntry.day} · ${dayEntry.category}
- **URL:** ${q.url}

---

## Intuition
<!-- Write the core insight and why the brute-force approach can be improved -->


## Pattern
<!-- e.g., Two Pointers, Sliding Window, Hash Map, Binary Search, DP -->


## Complexity Analysis
- **Time Complexity (TC):**
  - Bruteforce: \`O(...)\`
  - Better: \`O(...)\`
  - Optimised: \`O(...)\`
- **Space Complexity (SC):**
  - Bruteforce: \`O(...)\`
  - Better: \`O(...)\`
  - Optimised: \`O(...)\`

## Resources
- [Problem Link](${q.url})
- <!-- Add editorial, article, or video links here -->

## Approaches
- [Bruteforce Approach](./bruteforce.java)
- [Better Approach](./better.java)
- [Optimised Approach](./optimised.java)
`;
}

function buildNonDsaUnderstandingTemplate(dayEntry, q) {
  const typeLabel = q.type || (dayEntry.type === 'design' ? 'System Design / OOD' : 'Behavioral');
  const isDesign = dayEntry.type === 'design';

  return `# ${q.name}

- **Question Name:** ${q.name}
- **Question Number:** TBD
- **Type:** ${typeLabel}
- **Week / Day / Category:** Week ${dayEntry.week} · Day ${dayEntry.day} · ${dayEntry.category}
- **URL:** ${q.url}

---

## Intuition
${isDesign
    ? '<!-- Core requirements (functional & non-functional), scale estimates, and high-level architecture -->'
    : '<!-- Key signal the interviewer is looking for and STAR story summary (Situation, Task, Action, Result) -->'}


## Pattern
${isDesign
    ? '<!-- e.g., Rate Limiting, Consistent Hashing, Sharding, Caching, OOP Design Patterns -->'
    : '<!-- e.g., Ownership, Conflict Resolution, Ambiguity, Customer Obsession, Failure & Learning -->'}


## Complexity Analysis
- **Time Complexity (TC):** ${isDesign ? '`N/A (Latency / QPS / Throughput targets)`' : '`N/A`'}
- **Space Complexity (SC):** ${isDesign ? '`N/A (Storage / Bandwidth estimates)`' : '`N/A`'}

## Resources
- [Reference Search / Prompt](${q.url})
- <!-- Add articles, architecture diagrams, or STAR notes here -->

## Approaches
${isDesign
    ? '- High-Level Design & Trade-offs: document directly in **Intuition** above.'
    : '- STAR Breakdown & Key Takeaways: document directly in **Intuition** above.'}
`;
}

function buildJavaTemplate(dayEntry, q, tier) {
  const className =
    tier === 'bruteforce'
      ? 'BruteforceSolution'
      : tier === 'better'
        ? 'BetterSolution'
        : 'OptimisedSolution';
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return `/**
 * Question: ${q.name}
 * URL: ${q.url}
 * Week ${dayEntry.week} | Day ${dayEntry.day} | ${dayEntry.category}
 * Approach: ${tierLabel}
 *
 * Time Complexity:  O(...)
 * Space Complexity: O(...)
 */

public class ${className} {
    public static void main(String[] args) {
        // TODO: Add test cases for ${q.name} (${tierLabel})
    }
}
`;
}

function buildRevisionReadme(dayEntry) {
  return `# Day ${dayEntry.day} — ${dayEntry.category}

- **Week:** ${dayEntry.weekTitle || `Week ${dayEntry.week}`}
- **Phase:** ${dayEntry.phase || ''}
- **Goal:** ${dayEntry.title || 'Revise previously solved questions'}

---

## Revision Checklist
- [ ] Re-solve flagged / hard problems without looking at solutions
- [ ] Review key patterns and complexity trade-offs in \`understanding.md\`
- [ ] Consolidate edge cases and common pitfalls
`;
}

function ensureConceptsAndTracker(stats) {
  const starterConcepts = {
    '01-Java-DSA-Cheatsheet.md': `# Java DSA Cheat Sheet

A quick reference for Java collections, idioms, and complexity rules used across solutions.

## Collections & Common Operations

| Structure | Java Class | Common Methods | Time Complexity |
|---|---|---|---|
| Dynamic Array | \`ArrayList<>\` | \`add\`, \`get\`, \`set\`, \`remove(last)\` | \`O(1)\` amortized |
| Hash Map | \`HashMap<K, V>\` | \`put\`, \`getOrDefault\`, \`containsKey\`, \`computeIfAbsent\` | \`O(1)\` avg |
| Hash Set | \`HashSet<T>\` | \`add\`, \`contains\`, \`remove\` | \`O(1)\` avg |
| Stack / Queue | \`ArrayDeque<T>\` | \`push\`, \`pop\`, \`offer\`, \`poll\`, \`peek\` | \`O(1)\` |
| Min / Max Heap | \`PriorityQueue<T>\` | \`offer\`, \`poll\`, \`peek\` | \`O(log n)\` / \`O(1)\` |
| Balanced BST | \`TreeMap<K, V>\` | \`floorKey\`, \`ceilingKey\`, \`firstKey\`, \`lastKey\` | \`O(log n)\` |

## Useful Snippets

\`\`\`java
// Custom comparator (Max-Heap)
PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> Integer.compare(b, a));

// Frequency map
Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
\`\`\`
`,
    '02-Core-Patterns-Playbook.md': `# Core DSA Patterns Playbook

Document your reusable problem-solving templates and recognition triggers here.

## 1. Two Pointers
- **When to use:** Sorted arrays, palindrome checks, pair sums, removing duplicates in-place.
- **Key idea:** Shrink search space from both ends or maintain slow/fast pointers.

## 2. Sliding Window
- **When to use:** Contiguous subarray / substring problems with constraints (length, sum, distinct chars).
- **Template:** Expand \`right\`, update window state, shrink \`left\` while invalid/valid.

## 3. Binary Search on Answer
- **When to use:** "Find minimum/maximum X such that condition(X) is feasible" with monotonic property.

## 4. Monotonic Stack / Queue
- **When to use:** Next greater/smaller element, histogram area, sliding window maximum.

## 5. Graphs & Trees (BFS / DFS)
- **BFS:** Shortest path in unweighted graph, level-order traversal.
- **DFS:** Connected components, topological sort, cycle detection, tree recursion.
`,
    '03-System-Design-Notes.md': `# System Design Building Blocks

Summarize key architecture concepts, trade-offs, and back-of-the-envelope numbers here.

## Core Topics
- **Load Balancing & API Gateway:** L4 vs L7, health checks, rate limiting algorithms (Token Bucket, Sliding Window).
- **Caching:** Cache-aside, write-through, write-back, eviction policies (LRU/LFU).
- **Databases & Scaling:** Read replicas, sharding/partitioning keys, consistent hashing, SQL vs NoSQL trade-offs.
- **Async Processing:** Message queues (Kafka/SQS), dead-letter queues, idempotency keys.
`,
    '04-Learnings-and-Mistakes-Log.md': `# Learnings & Mistakes Log

Keep track of edge cases, wrong assumptions, and key takeaways from daily practice.

## Template Entry
- **Date:** YYYY-MM-DD
- **Topic / Question:** ...
- **What went wrong / Key insight:** ...
- **Rule to remember:** ...
`
  };

  for (const [filename, content] of Object.entries(starterConcepts)) {
    writeIfMissing(path.join(CONCEPTS_DIR, filename), content, stats);
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const starterTracker = {
    startDate: todayStr,
    activeDayOverride: null,
    leetcodeUsername: '',
    autoSyncLeetcode: false,
    todayTargets: [
      'Solve today\'s scheduled DSA problems with Bruteforce -> Better -> Optimised',
      'Write Intuition, Pattern, and TC/SC in understanding.md',
      'Log key learnings in Concepts/04-Learnings-and-Mistakes-Log.md'
    ],
    dailyNotes: {}
  };

  writeIfMissing(TRACKER_FILE, JSON.stringify(starterTracker, null, 2) + '\n', stats);
}

/**
 * Recursively scan Concepts/ for all .md files.
 */
function scanConcepts() {
  if (!fs.existsSync(CONCEPTS_DIR)) return [];
  const results = [];

  function walk(dir, groupParts) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, [...groupParts, entry.name]);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
        const content = fs.readFileSync(fullPath, 'utf8');
        const headingMatch = content.match(/^#\s+(.+)$/m);
        const fallbackTitle = entry.name
          .replace(/\.md$/i, '')
          .replace(/^\d+[-_ ]*/, '')
          .replace(/[-_]+/g, ' ');
        const title = headingMatch ? headingMatch[1].trim() : fallbackTitle;
        const group = groupParts.length ? groupParts.join(' / ') : 'General';
        results.push({
          id: `concept::${relPath}`,
          title,
          group,
          path: relPath
        });
      }
    }
  }

  walk(CONCEPTS_DIR, []);
  return results;
}

/**
 * Inspect question files to determine if notes/code have been filled in beyond starter templates.
 */
function inspectQuestionFiles(qAbsPath, dayEntry, q, isDsa) {
  const mdPath = path.join(qAbsPath, 'understanding.md');
  let hasNotes = false;
  let explicitStatus = null;
  let explicitSolvedDate = null;

  if (fs.existsSync(mdPath)) {
    const actualMd = fs.readFileSync(mdPath, 'utf8');
    const templateMd = isDsa
      ? buildDsaUnderstandingTemplate(dayEntry, q)
      : buildNonDsaUnderstandingTemplate(dayEntry, q);

    hasNotes = normalizeText(actualMd) !== normalizeText(templateMd);

    const statusMatch = actualMd.match(/^\s*[-*]\s*\*\*Status:\*\*\s*(.+)$/im);
    if (statusMatch) {
      const rawStatus = statusMatch[1].trim().toLowerCase();
      if (rawStatus.includes('revise') || rawStatus.includes('review')) explicitStatus = 'revise';
      else if (rawStatus.includes('solved') || rawStatus.includes('done')) explicitStatus = 'solved';
      else if (rawStatus.includes('progress')) explicitStatus = 'in-progress';
    }

    const dateMatch = actualMd.match(/^\s*[-*]\s*\*\*(?:Solved\s+Date|Date):\*\*\s*(\d{4}-\d{2}-\d{2})/im);
    if (dateMatch) {
      explicitSolvedDate = dateMatch[1];
    }
  }

  const hasCode = { bruteforce: false, better: false, optimised: false };
  if (isDsa) {
    for (const tier of ['bruteforce', 'better', 'optimised']) {
      const javaPath = path.join(qAbsPath, `${tier}.java`);
      if (fs.existsSync(javaPath)) {
        const actualJava = fs.readFileSync(javaPath, 'utf8');
        const templateJava = buildJavaTemplate(dayEntry, q, tier);
        hasCode[tier] = normalizeText(actualJava) !== normalizeText(templateJava);
      }
    }
  }

  const anyCode = hasCode.bruteforce || hasCode.better || hasCode.optimised;
  let status = explicitStatus;
  if (!status) {
    if (isDsa) {
      if (anyCode) status = 'solved';
      else if (hasNotes) status = 'in-progress';
      else status = 'todo';
    } else {
      status = hasNotes ? 'solved' : 'todo';
    }
  }

  return { hasNotes, hasCode, status, explicitSolvedDate };
}

/**
 * Parse git log to map commit dates -> touched question IDs & concept IDs,
 * plus track earliest and latest commit date per question folder.
 */
function buildGitActivity(questionPathToId, conceptPathToId) {
  const activityByDate = {};
  const lastUpdatedByPath = {};
  const questionCommitDates = new Map();

  try {
    const out = execFileSync(
      'git',
      ['log', '--name-only', '--pretty=format:__COMMIT__%H|%ad|%s', '--date=short'],
      { cwd: ROOT_DIR, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
    );

    let current = null;
    for (const rawLine of out.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;

      if (line.startsWith('__COMMIT__')) {
        const payload = line.slice('__COMMIT__'.length);
        const [hash, date, ...subjectParts] = payload.split('|');
        const subject = subjectParts.join('|');
        const isScaffold = hash === INITIAL_SCAFFOLD_COMMIT;
        const isAutoIndex =
          subject.includes('[skip ci]') ||
          subject.includes('[skip actions]') ||
          subject.startsWith('chore(index):');
        current = (!isScaffold && !isAutoIndex && date) ? { date, skip: false } : { date, skip: true };
        continue;
      }

      if (!current || current.skip) continue;
      const filePath = line.replace(/\\/g, '/');

      if (!lastUpdatedByPath[filePath] || current.date > lastUpdatedByPath[filePath]) {
        lastUpdatedByPath[filePath] = current.date;
      }

      const dayEntry = activityByDate[current.date] || {
        questions: [],
        concepts: [],
        trackerUpdated: false
      };

      const folderPath = filePath.split('/').slice(0, -1).join('/');
      if (questionPathToId.has(folderPath)) {
        const qId = questionPathToId.get(folderPath);
        if (!dayEntry.questions.includes(qId)) dayEntry.questions.push(qId);

        const prev = questionCommitDates.get(qId) || { earliest: current.date, latest: current.date };
        if (current.date < prev.earliest) prev.earliest = current.date;
        if (current.date > prev.latest) prev.latest = current.date;
        questionCommitDates.set(qId, prev);
      } else if (conceptPathToId.has(filePath)) {
        const cId = conceptPathToId.get(filePath);
        if (!dayEntry.concepts.includes(cId)) dayEntry.concepts.push(cId);
      } else if (filePath === 'daily-tracker.json') {
        dayEntry.trackerUpdated = true;
      }

      if (dayEntry.questions.length || dayEntry.concepts.length || dayEntry.trackerUpdated) {
        activityByDate[current.date] = dayEntry;
      }
    }
  } catch (_) {
    // Git not initialized or unavailable; return empty activity gracefully.
  }

  return { activityByDate, lastUpdatedByPath, questionCommitDates };
}

function buildRootReadme(weeksIndex, concepts, totals) {
  const lines = [
    '# DSA & Interview Prep Revision Vault',
    '',
    `A **${totals.weeks}-Week (${totals.days} Days · ${totals.questions} Questions)** Git-backed preparation repository & static revision web app covering DSA, System Design / OOD, Behavioral interviews, Revision checkpoints, and **Concepts & Learnings**.`,
    '',
    '## Live Repo Progress',
    `| Metric | Progress |`,
    `|---|---|`,
    `| **Questions Solved** | **${totals.repoSolved} / ${totals.questions}** |`,
    `| **Days Completed** | **${totals.daysCompleted} / ${totals.days}** |`,
    `| **Weeks Completed** | **${totals.weeksCompleted} / ${totals.weeks}** |`,
    `| **Problem Notes Written** | **${totals.repoNotes} / ${totals.questions}** |`,
    `| **Concept & Learning Notes** | **${concepts.length}** in [Concepts/](./Concepts) |`,
    '',
    '## Website Features (`index.html`)',
    '- **📊 One-Page Bento Dashboard:** Isolated single-screen summary built for tracking & sharing progress:',
    '  - **Progress Matrix:** Continuous block grid of all questions (`Easy`, `Medium`, `Hard`, `System Design`, `Behavioral`) plus **Days** and **Weeks** completion blocks.',
    '  - **Today\'s Target:** Smartly auto-advances to your next incomplete day (handles solving 2+ days in a single day seamlessly).',
    '  - **Solve Heatmap:** Contribution calendar showing daily solved problem counts.',
    '  - **Solved Today & Yesterday:** Lists solved questions with solve dates from Git history.',
    '- **🗺️ Roadmap Workspace:** Side-by-side `understanding.md` notes and syntax-highlighted `bruteforce.java` / `better.java` / `optimised.java` viewer with Week/Day/Question completion highlights.',
    '- **📚 Concepts & Learnings Hub:** Reads all `.md` files and subfolders inside [Concepts/](./Concepts).',
    '',
    '## Daily Git Workflow & Hosting',
    '1. Solve problems in `Week-*/Day-*/<Question>/` (`understanding.md` + `*.java`) or add notes in `Concepts/`.',
    '2. Optionally set `"startDate"` or `"activeDayOverride"` in [daily-tracker.json](./daily-tracker.json), or add `- **Status:** Solved` / `- **Solved Date:** YYYY-MM-DD` in `understanding.md`.',
    '3. Commit and push to `main` — [update-index.yml](./.github/workflows/update-index.yml) automatically rebuilds [roadmap-index.json](./roadmap-index.json) and `README.md`, and **Vercel** deploys the updated site.',
    '- **Local Preview:** Run `npx serve .` or `python -m http.server 8000` in the repo root.',
    '',
    '## Question Breakdown',
    `- **DSA Questions:** ${totals.dsaQuestions} (\`bruteforce.java\`, \`better.java\`, \`optimised.java\`, \`understanding.md\`)`,
    `- **System Design & OOD:** ${totals.designQuestions} (\`understanding.md\`)`,
    `- **Behavioral Questions:** ${totals.behavioralQuestions} (\`understanding.md\`)`,
    `- **Revision Checkpoints:** ${totals.revisionDays} days`,
    ''
  ];

  if (concepts.length) {
    lines.push('## Concepts & Learnings', '');
    for (const c of concepts) {
      lines.push(`- [${c.title}](./${c.path}) *(${c.group})*`);
    }
    lines.push('');
  }

  lines.push('## Weekly Index', '');

  for (const wk of weeksIndex) {
    const wkBadge = wk.completed ? ' ✅' : '';
    lines.push(`<details>`);
    lines.push(`<summary><strong>${wk.weekTitle}${wkBadge}</strong> — ${wk.phase} (${wk.solvedCount}/${wk.totalCount} solved · ${wk.days.length} days)</summary>`);
    lines.push('');
    for (const d of wk.days) {
      if (d.type === 'revision') {
        const revMark = d.completed ? ' ✅' : '';
        lines.push(`- **Day ${d.day} (${d.category})${revMark}:** [${d.title || 'Revision'}](./${d.path}/README.md)`);
      } else {
        const dayMark = d.completed ? ' ✅' : '';
        lines.push(`- **Day ${d.day} — ${d.category}${dayMark}** (${d.solvedCount}/${d.totalCount} solved):`);
        for (const q of d.questions) {
          const badge = q.diff ? ` \`${q.diff}\`` : q.type ? ` \`${q.type}\`` : '';
          const qMark = q.status === 'solved' ? ' ✅' : q.hasNotes ? ' 📝' : '';
          lines.push(`  - [${q.name}](./${q.path}/understanding.md)${badge}${qMark}`);
        }
      }
    }
    lines.push('');
    lines.push(`</details>`);
    lines.push('');
  }

  return lines.join('\n');
}

function normalizeTitleKey(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function fetchLeetCodeRecentAc(username) {
  if (!username || typeof fetch !== 'function') return [];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'query recentAcSubmissions($username: String!, $limit: Int!) { recentAcSubmissionList(username: $username, limit: $limit) { id title titleSlug timestamp } }',
        variables: { username, limit: 50 }
      })
    });
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.data?.recentAcSubmissionList;
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn('LeetCode auto-sync skipped:', err && err.message ? err.message : String(err));
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function buildLcAcMap(submissions) {
  const map = new Map();
  for (const sub of submissions) {
    const tsSec = Number(sub.timestamp || 0);
    const isoDate = tsSec > 0 ? new Date(tsSec * 1000).toISOString().slice(0, 10) : null;
    for (const key of [normalizeTitleKey(sub.titleSlug), normalizeTitleKey(sub.title)]) {
      if (key && (!map.has(key) || (isoDate && isoDate < map.get(key).solvedDate))) {
        map.set(key, { title: sub.title, titleSlug: sub.titleSlug, solvedDate: isoDate });
      }
    }
  }
  return map;
}

function stampUnderstandingSolved(mdPath, solvedDate) {
  if (!fs.existsSync(mdPath)) return false;
  let content = fs.readFileSync(mdPath, 'utf8');
  if (/^\s*[-*]\s*\*\*Status:\*\*/im.test(content)) return false;
  const statusLines = solvedDate
    ? `- **Status:** Solved\n- **Solved Date:** ${solvedDate}\n`
    : `- **Status:** Solved\n`;
  if (content.includes('\n---\n')) {
    content = content.replace('\n---\n', `\n${statusLines}\n---\n`);
  } else {
    content = `${content.trimEnd()}\n\n${statusLines}`;
  }
  fs.writeFileSync(mdPath, content, 'utf8');
  return true;
}

async function main() {
  const roadmap = loadRoadmap();
  const stats = { created: 0, skipped: 0, dirsCreated: 0, lcSynced: 0 };
  const totals = {
    weeks: 0,
    days: roadmap.length,
    questions: 0,
    dsaQuestions: 0,
    designQuestions: 0,
    behavioralQuestions: 0,
    revisionDays: 0,
    concepts: 0,
    repoSolved: 0,
    repoNotes: 0,
    daysCompleted: 0,
    weeksCompleted: 0
  };

  ensureConceptsAndTracker(stats);

  let trackerCfg = {};
  try {
    trackerCfg = JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
  } catch (_) {}

  const lcUser = String(process.env.LEETCODE_USERNAME || trackerCfg.leetcodeUsername || '').trim();
  const shouldSyncLc = Boolean(lcUser && (trackerCfg.autoSyncLeetcode || process.argv.includes('--sync-leetcode')));
  const lcAcMap = shouldSyncLc ? buildLcAcMap(await fetchLeetCodeRecentAc(lcUser)) : new Map();

  const weeksMap = new Map();
  const questionPathToId = new Map();

  for (const dayEntry of roadmap) {
    const weekFolder = formatWeekFolder(dayEntry.week);
    const dayFolder = formatDayFolder(dayEntry);
    const dayRelPath = `${weekFolder}/${dayFolder}`;
    const dayAbsPath = path.join(ROOT_DIR, weekFolder, dayFolder);

    if (!fs.existsSync(dayAbsPath)) {
      fs.mkdirSync(dayAbsPath, { recursive: true });
      stats.dirsCreated++;
    }

    if (!weeksMap.has(dayEntry.week)) {
      weeksMap.set(dayEntry.week, {
        week: dayEntry.week,
        folder: weekFolder,
        weekTitle: dayEntry.weekTitle || `Week ${dayEntry.week}`,
        phase: dayEntry.phase || '',
        solvedCount: 0,
        totalCount: 0,
        completed: false,
        days: []
      });
    }

    const dayRecord = {
      day: dayEntry.day,
      category: dayEntry.category,
      type: dayEntry.type,
      title: dayEntry.title || null,
      path: dayRelPath,
      solvedCount: 0,
      totalCount: 0,
      completed: false,
      questions: []
    };

    const questions = dayEntry.questions || [];
    if (dayEntry.type === 'revision' || questions.length === 0) {
      totals.revisionDays++;
      const revReadme = path.join(dayAbsPath, 'README.md');
      writeIfMissing(revReadme, buildRevisionReadme(dayEntry), stats);
      if (fs.existsSync(revReadme)) {
        const revText = fs.readFileSync(revReadme, 'utf8');
        if (/- \*\*Status:\*\*\s*(Done|Solved|Completed)/im.test(revText)) {
          dayRecord.completed = true;
          totals.daysCompleted++;
        }
      }
    } else {
      const usedSlugs = new Set();
      for (const q of questions) {
        totals.questions++;
        let qFolder = sanitizeSegment(q.name, 72);
        if (usedSlugs.has(qFolder.toLowerCase())) {
          let idx = 2;
          while (usedSlugs.has(`${qFolder}-${idx}`.toLowerCase())) idx++;
          qFolder = `${qFolder}-${idx}`;
        }
        usedSlugs.add(qFolder.toLowerCase());

        const qRelPath = `${dayRelPath}/${qFolder}`;
        const qAbsPath = path.join(dayAbsPath, qFolder);
        if (!fs.existsSync(qAbsPath)) {
          fs.mkdirSync(qAbsPath, { recursive: true });
          stats.dirsCreated++;
        }

        const isDsa = dayEntry.type === 'dsa';
        if (isDsa) {
          totals.dsaQuestions++;
          writeIfMissing(
            path.join(qAbsPath, 'understanding.md'),
            buildDsaUnderstandingTemplate(dayEntry, q),
            stats
          );
          for (const tier of ['bruteforce', 'better', 'optimised']) {
            writeIfMissing(
              path.join(qAbsPath, `${tier}.java`),
              buildJavaTemplate(dayEntry, q, tier),
              stats
            );
          }
        } else {
          if (dayEntry.type === 'design') totals.designQuestions++;
          else if (dayEntry.type === 'behavioral') totals.behavioralQuestions++;
          writeIfMissing(
            path.join(qAbsPath, 'understanding.md'),
            buildNonDsaUnderstandingTemplate(dayEntry, q),
            stats
          );
        }

        const qId = `${dayEntry.day}::${qFolder}`;
        questionPathToId.set(qRelPath, qId);

        if (isDsa && lcAcMap.size > 0) {
          const slugMatch = (q.url || '').match(/leetcode\.com\/problems\/([^/?#]+)/i);
          const matchEntry =
            (slugMatch && lcAcMap.get(normalizeTitleKey(slugMatch[1]))) ||
            lcAcMap.get(normalizeTitleKey(q.name));
          if (matchEntry && stampUnderstandingSolved(path.join(qAbsPath, 'understanding.md'), matchEntry.solvedDate)) {
            stats.lcSynced++;
          }
        }

        const inspected = inspectQuestionFiles(qAbsPath, dayEntry, q, isDsa);
        if (inspected.status === 'solved') {
          totals.repoSolved++;
          dayRecord.solvedCount++;
        }
        if (inspected.hasNotes) totals.repoNotes++;
        dayRecord.totalCount++;

        dayRecord.questions.push({
          id: qId,
          name: q.name,
          diff: q.diff || null,
          type: q.type || dayEntry.type,
          slug: q.slug || null,
          url: q.url,
          hasJava: isDsa,
          path: qRelPath,
          status: inspected.status,
          hasNotes: inspected.hasNotes,
          hasCode: inspected.hasCode,
          solvedAt: inspected.explicitSolvedDate || null
        });
      }

      if (dayRecord.totalCount > 0 && dayRecord.solvedCount === dayRecord.totalCount) {
        dayRecord.completed = true;
        totals.daysCompleted++;
      }
    }

    const wkObj = weeksMap.get(dayEntry.week);
    wkObj.solvedCount += dayRecord.solvedCount;
    wkObj.totalCount += dayRecord.totalCount;
    wkObj.days.push(dayRecord);
  }

  const concepts = scanConcepts();
  totals.concepts = concepts.length;
  const conceptPathToId = new Map(concepts.map((c) => [c.path, c.id]));

  const { activityByDate, lastUpdatedByPath, questionCommitDates } = buildGitActivity(
    questionPathToId,
    conceptPathToId
  );

  for (const c of concepts) {
    c.lastUpdated = lastUpdatedByPath[c.path] || null;
  }

  const solvedByDate = {};
  const weeksIndex = Array.from(weeksMap.values()).sort((a, b) => a.week - b.week);
  for (const wk of weeksIndex) {
    wk.completed = wk.totalCount > 0 && wk.solvedCount === wk.totalCount;
    if (wk.completed) totals.weeksCompleted++;

    for (const d of wk.days) {
      for (const q of d.questions) {
        const dates = questionCommitDates.get(q.id);
        q.lastUpdated = dates ? dates.latest : null;
        if (q.status === 'solved') {
          if (!q.solvedAt) {
            q.solvedAt = dates ? dates.earliest : null;
          }
          if (q.solvedAt) {
            if (!solvedByDate[q.solvedAt]) solvedByDate[q.solvedAt] = [];
            if (!solvedByDate[q.solvedAt].includes(q.id)) {
              solvedByDate[q.solvedAt].push(q.id);
            }
          }
        }
      }
    }
  }
  totals.weeks = weeksIndex.length;

  const indexPayload = {
    generatedAt: new Date().toISOString(),
    totals,
    concepts,
    activityByDate,
    solvedByDate,
    weeks: weeksIndex
  };

  fs.writeFileSync(
    path.join(ROOT_DIR, 'roadmap-index.json'),
    JSON.stringify(indexPayload, null, 2),
    'utf8'
  );
  fs.writeFileSync(
    path.join(ROOT_DIR, 'README.md'),
    buildRootReadme(weeksIndex, concepts, totals),
    'utf8'
  );
  fs.writeFileSync(path.join(ROOT_DIR, '.nojekyll'), '', 'utf8');

  console.log('Generation complete:', JSON.stringify({ totals, stats }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
