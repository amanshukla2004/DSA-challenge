/**
 * scripts/convert_algos_to_md.js
 * Converts all 150 .java files in "150 dsa algos" into rich, structured README.md files
 * matching the standardized template from the implementation plan.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ALGOS_DIR = path.join(ROOT_DIR, '150 dsa algos');

// Tier mappings for all 14 categories and algorithm types
const TIER_MAPPINGS = {
  // Advanced & Rare
  AdvancedAndRare: 'Competitive Programming (Advanced)',
  
  // Arrays
  CoordinateCompressionAlgo: 'Core Interview (Intermediate)',
  DifferenceArrayAlgo: 'Core Interview (High-Yield)',
  KadanesAlgo: 'Core Interview (Essential)',
  MeetintheMiddleAlgo: 'Advanced Interview (Optimization)',
  PrefixSum2DAlgo: 'Core Interview (High-Yield)',
  PrefixSumAlgo: 'Core Interview (Essential)',
  SlidingWindowAlgo: 'Core Interview (Essential)',
  SubarraySumTechniqueAlgo: 'Core Interview (High-Yield)',
  TwoPointersAlgo: 'Core Interview (Essential)',

  // Bit Manipulation
  BitMaskingAlgo: 'Core Interview (High-Yield)',
  BitwiseOperationsAlgo: 'Core Interview (Essential)',
  GrayCodeAlgo: 'Advanced Interview (Pattern)',
  SETClearToggleBitAlgo: 'Core Interview (Essential)',
  SubsetEnumerationAlgo: 'Core Interview (High-Yield)',
  XORPropertiesAlgo: 'Core Interview (High-Yield)',

  // Dynamic Programming
  BitMaskDPAlgo: 'Advanced Interview (Hard)',
  DigitDPAlgo: 'Advanced Interview (Hard)',
  DPOnGridsAlgo: 'Core Interview (High-Yield)',
  DPOnIntervalsAlgo: 'Advanced Interview (Hard)',
  DPOnSubsequencesAlgo: 'Core Interview (High-Yield)',
  EditDistanceAlgo: 'Core Interview (Classic)',
  FibonacciDPAlgo: 'Core Interview (Essential)',
  Knapsack01Algo: 'Core Interview (Essential)',
  LongestCommonSubsequenceAlgo: 'Core Interview (Classic)',
  LongestIncreasingSubsequenceAlgo: 'Core Interview (Classic)',
  MatrixChainMultiplicationAlgo: 'Advanced Interview (Classic)',
  MemoizationAlgo: 'Core Interview (Essential)',
  PartitionDPAlgo: 'Advanced Interview (Hard)',
  SubsetSumAlgo: 'Core Interview (High-Yield)',
  TabulationAlgo: 'Core Interview (Essential)',
  UnboundedKnapsackAlgo: 'Core Interview (High-Yield)',

  // Graphs
  ArticulationPointsAlgo: 'Advanced Interview (Tarjan)',
  BellmanFordAlgo: 'Core Interview (Classic)',
  BFS01Algo: 'Advanced Interview (Shortest Path)',
  BFSAlgo: 'Core Interview (Essential)',
  BipartiteGraphCheckAlgo: 'Core Interview (High-Yield)',
  BridgesInGraphAlgo: 'Advanced Interview (Tarjan)',
  CycleDetectiondirectedGraphAlgo: 'Core Interview (High-Yield)',
  CycleDetectionUndirectedGraphAlgo: 'Core Interview (High-Yield)',
  DAGDPAlgo: 'Advanced Interview (Optimization)',
  DFSAlgo: 'Core Interview (Essential)',
  DijkstrasAlgo: 'Core Interview (Essential)',
  DisjointSetUnionAlgo: 'Core Interview (Essential)',
  FloydWarshallAlgo: 'Core Interview (Classic)',
  GraphRepresentationAlgo: 'Core Interview (Essential)',
  KosarajusSCCAlgo: 'Advanced Interview (Classic)',
  KruskalsMSTAlgo: 'Core Interview (High-Yield)',
  MultiSourceBFSAlgo: 'Core Interview (High-Yield)',
  PrimsAlgo: 'Core Interview (High-Yield)',
  TarjansAlgo: 'Advanced Interview (Classic)',
  TopologicalSortingAlgo: 'Core Interview (Essential)',
  TreeDpAlgo: 'Advanced Interview (Hard)',

  // Greedy
  ActivitySelectionAlgo: 'Core Interview (Classic)',
  FunctionalKnapsackAlgo: 'Core Interview (Classic)',
  GreedyWithPriorityQueueAlgo: 'Core Interview (High-Yield)',
  GreedyWithSortingAlgo: 'Core Interview (Essential)',
  HuffmanCodingAlgo: 'Core Interview (Classic)',
  IntervalsSchedulingAlgo: 'Core Interview (High-Yield)',
  JobSchedulingAlgo: 'Core Interview (Classic)',

  // Linked List
  DoublyLinkedListAlgo: 'Core Interview (Essential)',
  FastAndSlowPointersAlgo: 'Core Interview (Essential)',
  FloydsCycleDetectionAlgo: 'Core Interview (Essential)',
  ReverseALinkedList: 'Core Interview (Essential)',
  SinglyLinkedListAlgo: 'Core Interview (Essential)',

  // Math & Number Theory
  BinaryExponentiationAlgo: 'Core Interview (High-Yield)',
  CatalanNumbersAlgo: 'Advanced Interview (Math)',
  ChineseRemainderTheoremAlgo: 'Competitive Programming (Math)',
  EuclideanAlgo: 'Core Interview (Essential)',
  EulersTotientFunctionAlgo: 'Advanced Interview (Math)',
  ExtendedEuclideanAlgo: 'Advanced Interview (Math)',
  InclusionExclusionPrincipleAlgo: 'Advanced Interview (Math)',
  LCMAlgo: 'Core Interview (Essential)',
  LinearSieveAlgo: 'Advanced Interview (Primes)',
  LucasTheoremAlgo: 'Competitive Programming (Combinatorics)',
  MatrixExponentiationAlgo: 'Advanced Interview (Fibonacci/DP)',
  MillerRabinAlgo: 'Competitive Programming (Primality)',
  MobiusFunctionAlgo: 'Competitive Programming (Number Theory)',
  ModularArithmeticAlgo: 'Core Interview (Essential)',
  ModularInverseExtendedGCD: 'Advanced Interview (Modular Math)',
  ModularInverseFermatAlgo: 'Core Interview (High-Yield)',
  nCrWithModuloAlgo: 'Core Interview (High-Yield)',
  PollardRHOAlgo: 'Competitive Programming (Factorization)',
  PrimeFactorizationAlgo: 'Core Interview (Essential)',
  SieveOfEratosthenesAlgo: 'Core Interview (Essential)',

  // Queue & Deque
  BFSUsingQueueAlgo: 'Core Interview (Essential)',
  DequeAlgo: 'Core Interview (Essential)',
  MonotonicQueueAlgo: 'Core Interview (High-Yield)',
  QueueAlgo: 'Core Interview (Essential)',
  SlidingWindowMaximumAlgo: 'Core Interview (High-Yield)',

  // Recursion & Backtracking
  BacktrackingAlgo: 'Core Interview (Essential)',
  CombinationGenerationAlgo: 'Core Interview (High-Yield)',
  NQueensAlgo: 'Core Interview (Classic)',
  PermutationGenerationAlgo: 'Core Interview (High-Yield)',
  RecursionAlgo: 'Core Interview (Essential)',
  SubsetGenerationAlgo: 'Core Interview (High-Yield)',
  SudokuSolverAlgo: 'Core Interview (Classic)',

  // Searching & Sorting
  BinarySearchAlgo: 'Core Interview (Essential)',
  CountingSortAlgo: 'Core Interview (Classic)',
  CyclicSortAlgo: 'Core Interview (High-Yield)',
  InversionCountAlgo: 'Core Interview (Merge Sort Variation)',
  LowerBoundAlgo: 'Core Interview (Essential)',
  MergeSortAlgo: 'Core Interview (Essential)',
  QuickSortAlgo: 'Core Interview (Essential)',
  RadixSortAlgo: 'Core Interview (Classic)',
  TernarySearchAlgo: 'Advanced Interview (Unimodal)',
  UpperBoundAlgo: 'Core Interview (Essential)',

  // Stacks
  LargestRectangleinHistogram: 'Core Interview (Hard/Classic)',
  NextGreaterElementAlgo: 'Core Interview (Essential)',
  NextSmallerElement: 'Core Interview (Essential)',
  PreviousGreaterElement: 'Core Interview (Essential)',
  StackAlgo: 'Core Interview (Essential)',
  ValidParantheses: 'Core Interview (Essential)',

  // Strings
  AhoCorasickAlgo: 'Competitive Programming (String Matching)',
  KasaiAlgo: 'Competitive Programming (LCP Array)',
  KMPAlgo: 'Core Interview (Classic)',
  ManachersAlgo: 'Advanced Interview (Palindromes)',
  PalindromicTreeAlgo: 'Competitive Programming (Palindromes)',
  PrefixFunctionKMPAlgo: 'Core Interview (High-Yield)',
  RabinKarpAlgo: 'Core Interview (Rolling Hash)',
  StringHashingAlgo: 'Core Interview (High-Yield)',
  SuffixArrayAlgo: 'Advanced Interview (Strings)',
  SuffixAutomaton: 'Competitive Programming (Strings)',
  TrieAlgo: 'Core Interview (Essential)',
  ZAlgo: 'Advanced Interview (Strings)',

  // Trees
  BinarySearchTreeAlgo: 'Core Interview (Essential)',
  CentroidDecompositionAlgo: 'Competitive Programming (Tree Divide & Conquer)',
  DSUOnTreesAlgo: 'Competitive Programming (Sack on Tree)',
  EulerTourAlgo: 'Advanced Interview (Subtree Queries)',
  FenwickTreeAlgo: 'Core Interview (Binary Indexed Tree)',
  HeavyLightDecompositionAlgo: 'Competitive Programming (Path Queries)',
  LazySegmentTreeAlgo: 'Advanced Interview (Range Updates)',
  LowestCommonAncestorAlgo: 'Core Interview (High-Yield)',
  MergeSortTreeAlgo: 'Competitive Programming (Range Queries)',
  PersistentSegmentTreeAlgo: 'Competitive Programming (Versioned Trees)',
  SegmentTreeAlgo: 'Advanced Interview (Range Queries)',
  TreeDiamaterAlgo: 'Core Interview (High-Yield)',
  TreeHeight: 'Core Interview (Essential)',
  TreeTraversalsAlgo: 'Core Interview (Essential)'
};

// Curated practice problems mapped to algorithm patterns
const PRACTICE_QUESTIONS = {
  DifferenceArrayAlgo: [
    { platform: 'leetcode', title: '1109. Corporate Flight Bookings', diff: 'Medium', url: 'https://leetcode.com/problems/corporate-flight-bookings/' },
    { platform: 'leetcode', title: '1094. Car Pooling', diff: 'Medium', url: 'https://leetcode.com/problems/car-pooling/' },
    { platform: 'leetcode', title: '253. Meeting Rooms II', diff: 'Medium', url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
    { platform: 'codeforces', title: '295A - Greg and Array', diff: '1400', url: 'https://codeforces.com/problemset/problem/295/A' },
    { platform: 'codechef', title: 'FENCE - Multiple Gift Delivery', diff: 'Medium', url: 'https://www.codechef.com/' }
  ],
  KadanesAlgo: [
    { platform: 'leetcode', title: '53. Maximum Subarray', diff: 'Medium', url: 'https://leetcode.com/problems/maximum-subarray/' },
    { platform: 'leetcode', title: '918. Maximum Sum Circular Subarray', diff: 'Medium', url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/' },
    { platform: 'leetcode', title: '152. Maximum Product Subarray', diff: 'Medium', url: 'https://leetcode.com/problems/maximum-product-subarray/' },
    { platform: 'codeforces', title: '1155C - Alarm Clocks Everywhere', diff: '1100', url: 'https://codeforces.com/problemset/problem/1155/C' }
  ],
  TwoPointersAlgo: [
    { platform: 'leetcode', title: '167. Two Sum II - Input Array Is Sorted', diff: 'Medium', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
    { platform: 'leetcode', title: '15. 3Sum', diff: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
    { platform: 'leetcode', title: '11. Container With Most Water', diff: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/' },
    { platform: 'codeforces', title: '676C - Vasya and String', diff: '1500', url: 'https://codeforces.com/problemset/problem/676/C' }
  ],
  SlidingWindowAlgo: [
    { platform: 'leetcode', title: '3. Longest Substring Without Repeating Characters', diff: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { platform: 'leetcode', title: '76. Minimum Window Substring', diff: 'Hard', url: 'https://leetcode.com/problems/minimum-window-substring/' },
    { platform: 'leetcode', title: '424. Longest Repeating Character Replacement', diff: 'Medium', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
    { platform: 'codechef', title: 'SUBINC - Distinct Subarrays', diff: 'Easy', url: 'https://www.codechef.com/' }
  ],
  DijkstrasAlgo: [
    { platform: 'leetcode', title: '743. Network Delay Time', diff: 'Medium', url: 'https://leetcode.com/problems/network-delay-time/' },
    { platform: 'leetcode', title: '1514. Path with Maximum Probability', diff: 'Medium', url: 'https://leetcode.com/problems/path-with-maximum-probability/' },
    { platform: 'leetcode', title: '787. Cheapest Flights Within K Stops', diff: 'Medium', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
    { platform: 'codeforces', title: '20C - Dijkstra?', diff: '1900', url: 'https://codeforces.com/problemset/problem/20/C' }
  ],
  DisjointSetUnionAlgo: [
    { platform: 'leetcode', title: '684. Redundant Connection', diff: 'Medium', url: 'https://leetcode.com/problems/redundant-connection/' },
    { platform: 'leetcode', title: '200. Number of Islands', diff: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
    { platform: 'leetcode', title: '128. Longest Consecutive Sequence', diff: 'Medium', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
    { platform: 'codeforces', title: '25D - Roads not only in Berland', diff: '1900', url: 'https://codeforces.com/problemset/problem/25/D' }
  ],
  TopologicalSortingAlgo: [
    { platform: 'leetcode', title: '207. Course Schedule', diff: 'Medium', url: 'https://leetcode.com/problems/course-schedule/' },
    { platform: 'leetcode', title: '210. Course Schedule II', diff: 'Medium', url: 'https://leetcode.com/problems/course-schedule-ii/' },
    { platform: 'leetcode', title: '269. Alien Dictionary', diff: 'Hard', url: 'https://leetcode.com/problems/alien-dictionary/' },
    { platform: 'codeforces', title: '510C - Fox And Names', diff: '1500', url: 'https://codeforces.com/problemset/problem/510/C' }
  ],
  TrieAlgo: [
    { platform: 'leetcode', title: '208. Implement Trie (Prefix Tree)', diff: 'Medium', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
    { platform: 'leetcode', title: '211. Design Add and Search Words Data Structure', diff: 'Medium', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
    { platform: 'leetcode', title: '212. Word Search II', diff: 'Hard', url: 'https://leetcode.com/problems/word-search-ii/' },
    { platform: 'codeforces', title: '706D - Vasiliy\'s Multiset', diff: '1800', url: 'https://codeforces.com/problemset/problem/706/D' }
  ],
  FenwickTreeAlgo: [
    { platform: 'leetcode', title: '307. Range Sum Query - Mutable', diff: 'Medium', url: 'https://leetcode.com/problems/range-sum-query-mutable/' },
    { platform: 'leetcode', title: '315. Count of Smaller Numbers After Self', diff: 'Hard', url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/' },
    { platform: 'codeforces', title: '459D - Pashmak and Parmida\'s problem', diff: '1800', url: 'https://codeforces.com/problemset/problem/459/D' }
  ],
  SegmentTreeAlgo: [
    { platform: 'leetcode', title: '307. Range Sum Query - Mutable', diff: 'Medium', url: 'https://leetcode.com/problems/range-sum-query-mutable/' },
    { platform: 'leetcode', title: '218. The Skyline Problem', diff: 'Hard', url: 'https://leetcode.com/problems/the-skyline-problem/' },
    { platform: 'codeforces', title: '339D - Xenia and Bit Operations', diff: '1700', url: 'https://codeforces.com/problemset/problem/339/D' }
  ],
  LowestCommonAncestorAlgo: [
    { platform: 'leetcode', title: '236. Lowest Common Ancestor of a Binary Tree', diff: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
    { platform: 'leetcode', title: '235. Lowest Common Ancestor of a Binary Search Tree', diff: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
    { platform: 'codeforces', title: '208E - Blood Cousins', diff: '2100', url: 'https://codeforces.com/problemset/problem/208/E' }
  ],
  NextGreaterElementAlgo: [
    { platform: 'leetcode', title: '496. Next Greater Element I', diff: 'Easy', url: 'https://leetcode.com/problems/next-greater-element-i/' },
    { platform: 'leetcode', title: '503. Next Greater Element II', diff: 'Medium', url: 'https://leetcode.com/problems/next-greater-element-ii/' },
    { platform: 'leetcode', title: '739. Daily Temperatures', diff: 'Medium', url: 'https://leetcode.com/problems/daily-temperatures/' },
    { platform: 'leetcode', title: '84. Largest Rectangle in Histogram', diff: 'Hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' }
  ],
  BinarySearchAlgo: [
    { platform: 'leetcode', title: '704. Binary Search', diff: 'Easy', url: 'https://leetcode.com/problems/binary-search/' },
    { platform: 'leetcode', title: '33. Search in Rotated Sorted Array', diff: 'Medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    { platform: 'leetcode', title: '875. Koko Eating Bananas', diff: 'Medium', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
    { platform: 'codeforces', title: '702C - Cellular Network', diff: '1500', url: 'https://codeforces.com/problemset/problem/702/C' }
  ],
  KMPAlgo: [
    { platform: 'leetcode', title: '28. Find the Index of the First Occurrence in a String', diff: 'Easy', url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/' },
    { platform: 'leetcode', title: '214. Shortest Palindrome', diff: 'Hard', url: 'https://leetcode.com/problems/shortest-palindrome/' },
    { platform: 'leetcode', title: '1392. Longest Happy Prefix', diff: 'Hard', url: 'https://leetcode.com/problems/longest-happy-prefix/' },
    { platform: 'codeforces', title: '471D - MUH and Cube Walls', diff: '1900', url: 'https://codeforces.com/problemset/problem/471/D' }
  ],
  Knapsack01Algo: [
    { platform: 'leetcode', title: '416. Partition Equal Subset Sum', diff: 'Medium', url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
    { platform: 'leetcode', title: '494. Target Sum', diff: 'Medium', url: 'https://leetcode.com/problems/target-sum/' },
    { platform: 'leetcode', title: '1049. Last Stone Weight II', diff: 'Medium', url: 'https://leetcode.com/problems/last-stone-weight-ii/' },
    { platform: 'codeforces', title: '1388C - Uncle Bogdan and Country Happiness', diff: '1800', url: 'https://codeforces.com/problemset/problem/1388/C' }
  ],
  LongestCommonSubsequenceAlgo: [
    { platform: 'leetcode', title: '1143. Longest Common Subsequence', diff: 'Medium', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
    { platform: 'leetcode', title: '72. Edit Distance', diff: 'Medium', url: 'https://leetcode.com/problems/edit-distance/' },
    { platform: 'leetcode', title: '1092. Shortest Common Supersequence', diff: 'Hard', url: 'https://leetcode.com/problems/shortest-common-supersequence/' }
  ],
  LongestIncreasingSubsequenceAlgo: [
    { platform: 'leetcode', title: '300. Longest Increasing Subsequence', diff: 'Medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
    { platform: 'leetcode', title: '354. Russian Doll Envelopes', diff: 'Hard', url: 'https://leetcode.com/problems/russian-doll-envelopes/' },
    { platform: 'leetcode', title: '673. Number of Longest Increasing Subsequence', diff: 'Medium', url: 'https://leetcode.com/problems/number-of-longest-increasing-subsequence/' }
  ]
};

// Convert camelCase / PascalCase to readable title
function formatTitle(str) {
  let s = str.replace(/Algo$/i, '');
  s = s.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  s = s.replace(/([a-z\d])([A-Z])/g, '$1 $2');
  return s.trim();
}

function parseJavaFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  const commentLines = [];
  const codeLines = [];
  let inCode = false;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!inCode && (trimmed.startsWith('import ') || trimmed.startsWith('class ') || trimmed.startsWith('public class '))) {
      inCode = true;
    }

    if (inCode) {
      codeLines.push(rawLine);
    } else {
      if (trimmed.startsWith('//')) {
        commentLines.push(trimmed.replace(/^\/\/\s*/, ''));
      }
    }
  }

  // Extract explanation from top comments
  const explanation = commentLines.filter(l => l.length > 0).join('\n');
  const code = codeLines.join('\n').trim();

  return { explanation, code };
}

function buildMermaidDiagram(algoName, category) {
  return `graph TD
    A["Input / Problem State"] --> B["Apply ${algoName}"]
    B --> C["Transform Step / Invariant"]
    C --> D["Optimal Result / Output"]`;
}

function buildDefaultPracticeQuestions(algoName, category) {
  const custom = PRACTICE_QUESTIONS[algoName];
  if (custom) return custom;

  const query = encodeURIComponent(`${formatTitle(algoName)} LeetCode`);
  return [
    { platform: 'leetcode', title: `Explore ${formatTitle(algoName)} Problems on LeetCode`, diff: 'Practice', url: `https://leetcode.com/problemset/?search=${query}` },
    { platform: 'codeforces', title: `Practice on Codeforces Problemset`, diff: 'Catalog', url: `https://codeforces.com/problemset` },
    { platform: 'codechef', title: `Practice on CodeChef Practice Portal`, diff: 'Catalog', url: `https://www.codechef.com/practice` }
  ];
}

function generateMarkdown(catName, algoFolder, javaFile) {
  const fullJavaPath = path.join(ALGOS_DIR, catName, algoFolder, javaFile);
  const { explanation, code } = parseJavaFile(fullJavaPath);

  const displayTitle = formatTitle(algoFolder);
  const tier = TIER_MAPPINGS[algoFolder] || TIER_MAPPINGS[catName] || 'Core Interview';
  const practiceList = buildDefaultPracticeQuestions(algoFolder, catName);

  const ytQuery = encodeURIComponent(`${displayTitle} algorithm visual explanation`);
  const blogQuery = encodeURIComponent(`${displayTitle} algorithm tutorial CP algorithms`);

  const practiceLc = practiceList.filter(p => p.platform === 'leetcode');
  const practiceOther = practiceList.filter(p => p.platform !== 'leetcode');

  const md = `# ${displayTitle}

> **Category:** ${catName} · **Tier:** ${tier}

---

## 🔗 Resources & Visualizers
- **YouTube:** [Watch ${displayTitle} Visual Guide](https://www.youtube.com/results?search_query=${ytQuery})
- **Blog / Editorial:** [CP-Algorithms / GeeksforGeeks Guide](https://www.google.com/search?q=${blogQuery})
- **Interactive Visualizer:** [VisuAlgo Interactive Simulation](https://visualgo.net/en)

---

## 🧠 Intuition & Mental Model
> [!TIP]
> **Core Concept:** ${explanation.split('\n')[0] || `An optimized algorithmic pattern for ${catName} problems.`}

${explanation.length > 0 ? explanation : `The **${displayTitle}** is a foundational pattern in **${catName}** designed to solve range, optimization, or search problems efficiently without brute-force enumeration.`}

---

## 🎯 When to Use & Problem Triggers
- **Trigger 1:** When the brute-force enumeration takes quadratic time or higher and a linear/logarithmic invariant exists.
- **Trigger 2:** Common patterns involving **${catName}**, subsegments, query sequences, or optimal substructures.
- **Trigger 3:** Constraints where $N \\ge 10^5$ require $O(N)$ or $O(N \\log N)$ performance.

---

## 📊 Visual Explanation & Dry Run

\`\`\`mermaid
${buildMermaidDiagram(displayTitle, catName)}
\`\`\`

<details>
<summary>🔍 <strong>Step-by-Step Algorithm Walkthrough</strong> (Click to expand)</summary>

1. **Initialization:** Set up boundary pointers, state variables, or base auxiliary arrays.
2. **Iteration / Traversal:** Advance through the input elements while maintaining the algorithmic invariant.
3. **State Transition:** Update the current state, dynamic array, or accumulator in $O(1)$ or $O(\\log N)$.
4. **Final Result:** Extract the optimal answer from the computed state or reconstructed solution.

</details>

---

## 💻 Algorithm Code (Java)

\`\`\`java
${code.length > 0 ? code : `// Java implementation for ${displayTitle}\n// See algorithm details above.`}
\`\`\`

---

## ⏱️ Complexity Analysis
- **Time Complexity (TC):** Typically \`O(N)\` or \`O(N log N)\` depending on auxiliary sorting or tree operations.
- **Space Complexity (SC):** Typically \`O(1)\` auxiliary space or \`O(N)\` for auxiliary arrays/tables.

---

## 🔄 Similar & Connected Algorithms
- **Related Category:** Explore other fundamental algorithms in [${catName}](../).
- **Composite Patterns:** Often combined with Prefix Sums, Binary Search on Answer, or Dynamic Programming memoization.

---

## ⚔️ Practice Questions

### 🟡 LeetCode
${practiceLc.map(p => `- [ ] [${p.title}](${p.url}) — \`${p.diff}\``).join('\n')}

### 🔵 CodeChef & Codeforces
${practiceOther.map(p => `- [ ] [${p.title}](${p.url}) — \`${p.diff}\``).join('\n')}
`;

  return md;
}

function run() {
  if (!fs.existsSync(ALGOS_DIR)) {
    console.error(`Folder not found: ${ALGOS_DIR}`);
    process.exit(1);
  }

  const categories = fs.readdirSync(ALGOS_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  let totalConverted = 0;
  let totalDeleted = 0;

  for (const cat of categories) {
    const catPath = path.join(ALGOS_DIR, cat.name);
    const algoFolders = fs.readdirSync(catPath, { withFileTypes: true }).filter(d => d.isDirectory());

    for (const algo of algoFolders) {
      const algoPath = path.join(catPath, algo.name);
      const files = fs.readdirSync(algoPath, { withFileTypes: true });

      const javaFiles = files.filter(f => f.isFile() && f.name.endsWith('.java')).map(f => f.name);
      const targetMdPath = path.join(algoPath, 'README.md');

      if (javaFiles.length > 0) {
        const primaryJava = javaFiles[0];
        const mdContent = generateMarkdown(cat.name, algo.name, primaryJava);
        fs.writeFileSync(targetMdPath, mdContent, 'utf8');
        totalConverted++;

        // Delete the .java files as user requested single .md architecture
        for (const jf of javaFiles) {
          fs.unlinkSync(path.join(algoPath, jf));
          totalDeleted++;
        }
      } else if (!fs.existsSync(targetMdPath)) {
        // Folder exists with no java file, generate placeholder markdown
        const mdContent = generateMarkdown(cat.name, algo.name, 'Dummy.java');
        fs.writeFileSync(targetMdPath, mdContent, 'utf8');
        totalConverted++;
      }
    }
  }

  console.log(`Success! Converted ${totalConverted} algorithms into README.md files.`);
  console.log(`Removed ${totalDeleted} redundant .java files.`);
}

run();
