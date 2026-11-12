const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'daily_data.js');

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
  fs.writeFileSync(filePath, content, 'utf8');
  stats.created++;
  return true;
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

function buildRootReadme(weeksIndex, totals) {
  const lines = [
    '# DSA & Interview Prep Roadmap',
    '',
    `A structured **${totals.weeks}-Week (${totals.days} Days · ${totals.questions} Questions)** preparation repository covering DSA, System Design / OOD, Behavioral interviews, and Revision checkpoints.`,
    '',
    '## Hosting & Revision Web App',
    'This repository includes a zero-build static revision viewer (`index.html`) that dynamically loads your `understanding.md` notes and `.java` solutions directly from the folders:',
    '- **GitHub Pages:** Settings → Pages → Deploy from branch (`main` / `/root`).',
    '- **Vercel / Netlify:** Connect the repo with no build command and publish directory `.`.',
    '- **Local Preview:** Run `npx serve .` or `python -m http.server 8000` in the repo root.',
    '',
    '## Summary',
    `- **DSA Questions:** ${totals.dsaQuestions} (with \`bruteforce.java\`, \`better.java\`, \`optimised.java\`, and \`understanding.md\`)`,
    `- **System Design & OOD:** ${totals.designQuestions} (with \`understanding.md\`)`,
    `- **Behavioral Questions:** ${totals.behavioralQuestions} (with \`understanding.md\`)`,
    `- **Revision Checkpoints:** ${totals.revisionDays} days`,
    '',
    '## Weekly Index',
    ''
  ];

  for (const wk of weeksIndex) {
    lines.push(`<details>`);
    lines.push(`<summary><strong>${wk.weekTitle}</strong> — ${wk.phase} (${wk.days.length} days)</summary>`);
    lines.push('');
    for (const d of wk.days) {
      if (d.type === 'revision') {
        lines.push(`- **Day ${d.day} (${d.category}):** [${d.title || 'Revision'}](./${d.path}/README.md)`);
      } else {
        lines.push(`- **Day ${d.day} — ${d.category}** (${d.questions.length} items):`);
        for (const q of d.questions) {
          const badge = q.diff ? ` \`${q.diff}\`` : q.type ? ` \`${q.type}\`` : '';
          lines.push(`  - [${q.name}](./${q.path}/understanding.md)${badge}`);
        }
      }
    }
    lines.push('');
    lines.push(`</details>`);
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const roadmap = loadRoadmap();
  const stats = { created: 0, skipped: 0, dirsCreated: 0 };
  const totals = {
    weeks: 0,
    days: roadmap.length,
    questions: 0,
    dsaQuestions: 0,
    designQuestions: 0,
    behavioralQuestions: 0,
    revisionDays: 0
  };

  const weeksMap = new Map();

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
        days: []
      });
    }

    const dayRecord = {
      day: dayEntry.day,
      category: dayEntry.category,
      type: dayEntry.type,
      title: dayEntry.title || null,
      path: dayRelPath,
      questions: []
    };

    const questions = dayEntry.questions || [];
    if (dayEntry.type === 'revision' || questions.length === 0) {
      totals.revisionDays++;
      writeIfMissing(path.join(dayAbsPath, 'README.md'), buildRevisionReadme(dayEntry), stats);
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

        dayRecord.questions.push({
          id: `${dayEntry.day}::${qFolder}`,
          name: q.name,
          diff: q.diff || null,
          type: q.type || dayEntry.type,
          slug: q.slug || null,
          url: q.url,
          hasJava: isDsa,
          path: qRelPath
        });
      }
    }

    weeksMap.get(dayEntry.week).days.push(dayRecord);
  }

  const weeksIndex = Array.from(weeksMap.values()).sort((a, b) => a.week - b.week);
  totals.weeks = weeksIndex.length;

  const indexPayload = {
    generatedAt: new Date().toISOString(),
    totals,
    weeks: weeksIndex
  };

  fs.writeFileSync(
    path.join(ROOT_DIR, 'roadmap-index.json'),
    JSON.stringify(indexPayload, null, 2),
    'utf8'
  );
  fs.writeFileSync(
    path.join(ROOT_DIR, 'README.md'),
    buildRootReadme(weeksIndex, totals),
    'utf8'
  );
  fs.writeFileSync(path.join(ROOT_DIR, '.nojekyll'), '', 'utf8');

  console.log('Generation complete:', JSON.stringify({ totals, stats }, null, 2));
}

main();

