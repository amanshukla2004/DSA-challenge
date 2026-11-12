# DSA & Interview Prep Revision Vault

A **21-Week (136 Days · 484 Questions)** Git-backed preparation repository & static revision web app covering DSA, System Design / OOD, Behavioral interviews, Revision checkpoints, and **Concepts & Learnings**.

## Live Repo Progress
| Metric | Progress |
|---|---|
| **Questions Solved** | **3 / 484** |
| **Days Completed** | **0 / 136** |
| **Weeks Completed** | **0 / 21** |
| **Problem Notes Written** | **2 / 484** |
| **Concept & Learning Notes** | **4** in [Concepts/](./Concepts) |

## Website Features (`index.html`)
- **📊 One-Page Bento Dashboard:** Isolated single-screen summary built for tracking & sharing progress:
  - **Progress Matrix:** Continuous block grid of all questions (`Easy`, `Medium`, `Hard`, `System Design`, `Behavioral`) plus **Days** and **Weeks** completion blocks.
  - **Today's Target:** Smartly auto-advances to your next incomplete day (handles solving 2+ days in a single day seamlessly).
  - **Solve Heatmap:** Contribution calendar showing daily solved problem counts.
  - **Solved Today & Yesterday:** Lists solved questions with solve dates from Git history.
- **🗺️ Roadmap Workspace:** Side-by-side `understanding.md` notes and syntax-highlighted `bruteforce.java` / `better.java` / `optimised.java` viewer with Week/Day/Question completion highlights.
- **📚 Concepts & Learnings Hub:** Reads all `.md` files and subfolders inside [Concepts/](./Concepts).

## Daily Git Workflow & Hosting
1. Solve problems in `Week-*/Day-*/<Question>/` (`understanding.md` + `*.java`) or add notes in `Concepts/`.
2. Optionally set `"startDate"` or `"activeDayOverride"` in [daily-tracker.json](./daily-tracker.json), or add `- **Status:** Solved` / `- **Solved Date:** YYYY-MM-DD` in `understanding.md`.
3. Commit and push to `main` — [update-index.yml](./.github/workflows/update-index.yml) automatically rebuilds [roadmap-index.json](./roadmap-index.json) and `README.md`, and **Vercel** deploys the updated site.
- **Local Preview:** Run `npx serve .` or `python -m http.server 8000` in the repo root.

## Question Breakdown
- **DSA Questions:** 416 (`bruteforce.java`, `better.java`, `optimised.java`, `understanding.md`)
- **System Design & OOD:** 42 (`understanding.md`)
- **Behavioral Questions:** 26 (`understanding.md`)
- **Revision Checkpoints:** 10 days

## Concepts & Learnings

- [Java DSA Cheat Sheet](./Concepts/01-Java-DSA-Cheatsheet.md) *(General)*
- [Core DSA Patterns Playbook](./Concepts/02-Core-Patterns-Playbook.md) *(General)*
- [System Design Building Blocks](./Concepts/03-System-Design-Notes.md) *(General)*
- [Learnings & Mistakes Log](./Concepts/04-Learnings-and-Mistakes-Log.md) *(General)*

## Weekly Index

<details>
<summary><strong>Week 1 (Days 1–7)</strong> — Phase 1: DSA Foundations & Core Structures (3/39 solved · 7 days)</summary>

- **Day 1 — Arrays** (3/6 solved):
  - [Two Sum](./Week-01/Day-001_Arrays/Two-Sum/understanding.md) `E` ✅
  - [Best Time to Buy and Sell Stock](./Week-01/Day-001_Arrays/Best-Time-to-Buy-and-Sell-Stock/understanding.md) `E` ✅
  - [Majority Element](./Week-01/Day-001_Arrays/Majority-Element/understanding.md) `E` ✅
  - [Move Zeroes](./Week-01/Day-001_Arrays/Move-Zeroes/understanding.md) `E`
  - [Squares of a Sorted Array](./Week-01/Day-001_Arrays/Squares-of-a-Sorted-Array/understanding.md) `E`
  - [Merge Sorted Array](./Week-01/Day-001_Arrays/Merge-Sorted-Array/understanding.md) `E`
- **Day 2 — Arrays** (0/7 solved):
  - [Remove Duplicates from Sorted Array](./Week-01/Day-002_Arrays/Remove-Duplicates-from-Sorted-Array/understanding.md) `E`
  - [Remove Duplicates from Sorted Array II](./Week-01/Day-002_Arrays/Remove-Duplicates-from-Sorted-Array-II/understanding.md) `M`
  - [Find All Numbers Disappeared in an Array](./Week-01/Day-002_Arrays/Find-All-Numbers-Disappeared-in-an-Array/understanding.md) `E`
  - [Intersection of Two Arrays](./Week-01/Day-002_Arrays/Intersection-of-Two-Arrays/understanding.md) `E`
  - [Intersection of Two Arrays II](./Week-01/Day-002_Arrays/Intersection-of-Two-Arrays-II/understanding.md) `E`
  - [Maximum Population Year](./Week-01/Day-002_Arrays/Maximum-Population-Year/understanding.md) `E`
  - [Find Pivot Index](./Week-01/Day-002_Arrays/Find-Pivot-Index/understanding.md) `E`
- **Day 3 — Arrays** (0/6 solved):
  - [Running Sum of 1d Array](./Week-01/Day-003_Arrays/Running-Sum-of-1d-Array/understanding.md) `E`
  - [Remove Element](./Week-01/Day-003_Arrays/Remove-Element/understanding.md) `E`
  - [Find Winner on a Tic Tac Toe Game](./Week-01/Day-003_Arrays/Find-Winner-on-a-Tic-Tac-Toe-Game/understanding.md) `E`
  - [Build Array from Permutation](./Week-01/Day-003_Arrays/Build-Array-from-Permutation/understanding.md) `E`
  - [Third Maximum Number](./Week-01/Day-003_Arrays/Third-Maximum-Number/understanding.md) `E`
  - [Valid Mountain Array](./Week-01/Day-003_Arrays/Valid-Mountain-Array/understanding.md) `E`
- **Day 4 — Arrays** (0/6 solved):
  - [Find Common Characters](./Week-01/Day-004_Arrays/Find-Common-Characters/understanding.md) `E`
  - [Sum of All Odd Length Subarrays](./Week-01/Day-004_Arrays/Sum-of-All-Odd-Length-Subarrays/understanding.md) `E`
  - [Range Sum Query - Immutable](./Week-01/Day-004_Arrays/Range-Sum-Query-Immutable/understanding.md) `E`
  - [Shuffle the Array](./Week-01/Day-004_Arrays/Shuffle-the-Array/understanding.md) `E`
  - [Max Consecutive Ones](./Week-01/Day-004_Arrays/Max-Consecutive-Ones/understanding.md) `E`
  - [Sort Array By Parity](./Week-01/Day-004_Arrays/Sort-Array-By-Parity/understanding.md) `E`
- **Day 5 — Linked List** (0/6 solved):
  - [Reverse Linked List](./Week-01/Day-005_Linked-List/Reverse-Linked-List/understanding.md) `E`
  - [Remove Linked List Elements](./Week-01/Day-005_Linked-List/Remove-Linked-List-Elements/understanding.md) `E`
  - [Remove Duplicates from Sorted List](./Week-01/Day-005_Linked-List/Remove-Duplicates-from-Sorted-List/understanding.md) `E`
  - [Merge Two Sorted Lists](./Week-01/Day-005_Linked-List/Merge-Two-Sorted-Lists/understanding.md) `E`
  - [Middle of the Linked List](./Week-01/Day-005_Linked-List/Middle-of-the-Linked-List/understanding.md) `E`
  - [Palindrome Linked List](./Week-01/Day-005_Linked-List/Palindrome-Linked-List/understanding.md) `E`
- **Day 6 — Linked List & Stack** (0/6 solved):
  - [Intersection of Two Linked Lists](./Week-01/Day-006_Linked-List-and-Stack/Intersection-of-Two-Linked-Lists/understanding.md) `E`
  - [Linked List Cycle](./Week-01/Day-006_Linked-List-and-Stack/Linked-List-Cycle/understanding.md) `E`
  - [Valid Parentheses](./Week-01/Day-006_Linked-List-and-Stack/Valid-Parentheses/understanding.md) `E`
  - [Implement Queue using Stacks](./Week-01/Day-006_Linked-List-and-Stack/Implement-Queue-using-Stacks/understanding.md) `E`
  - [Backspace String Compare](./Week-01/Day-006_Linked-List-and-Stack/Backspace-String-Compare/understanding.md) `E`
  - [Next Greater Element I](./Week-01/Day-006_Linked-List-and-Stack/Next-Greater-Element-I/understanding.md) `E`
- **Day 7 — System Design & OOD** (0/2 solved):
  - [Design a Rate Limiter](./Week-01/Day-007_System-Design-and-OOD/Design-a-Rate-Limiter/understanding.md) `System Design`
  - [Design a Library Management System](./Week-01/Day-007_System-Design-and-OOD/Design-a-Library-Management-System/understanding.md) `OOD Design`

</details>

<details>
<summary><strong>Week 2 (Days 8–14)</strong> — Phase 1: DSA Foundations & Core Structures (0/36 solved · 7 days)</summary>

- **Day 8 — Binary Trees** (0/6 solved):
  - [Binary Tree Preorder Traversal](./Week-02/Day-008_Binary-Trees/Binary-Tree-Preorder-Traversal/understanding.md) `E`
  - [Binary Tree Inorder Traversal](./Week-02/Day-008_Binary-Trees/Binary-Tree-Inorder-Traversal/understanding.md) `E`
  - [Binary Tree Postorder Traversal](./Week-02/Day-008_Binary-Trees/Binary-Tree-Postorder-Traversal/understanding.md) `E`
  - [Maximum Depth of Binary Tree](./Week-02/Day-008_Binary-Trees/Maximum-Depth-of-Binary-Tree/understanding.md) `E`
  - [Invert Binary Tree](./Week-02/Day-008_Binary-Trees/Invert-Binary-Tree/understanding.md) `E`
  - [Symmetric Tree](./Week-02/Day-008_Binary-Trees/Symmetric-Tree/understanding.md) `E`
- **Day 9 — Binary Trees** (0/5 solved):
  - [Subtree of Another Tree](./Week-02/Day-009_Binary-Trees/Subtree-of-Another-Tree/understanding.md) `E`
  - [Diameter of Binary Tree](./Week-02/Day-009_Binary-Trees/Diameter-of-Binary-Tree/understanding.md) `E`
  - [Balanced Binary Tree](./Week-02/Day-009_Binary-Trees/Balanced-Binary-Tree/understanding.md) `E`
  - [Merge Two Binary Trees](./Week-02/Day-009_Binary-Trees/Merge-Two-Binary-Trees/understanding.md) `E`
  - [Same Tree](./Week-02/Day-009_Binary-Trees/Same-Tree/understanding.md) `E`
- **Day 10 — Binary Trees & BST** (0/5 solved):
  - [Path Sum](./Week-02/Day-010_Binary-Trees-and-BST/Path-Sum/understanding.md) `E`
  - [Binary Tree Paths](./Week-02/Day-010_Binary-Trees-and-BST/Binary-Tree-Paths/understanding.md) `E`
  - [Cousins in Binary Tree](./Week-02/Day-010_Binary-Trees-and-BST/Cousins-in-Binary-Tree/understanding.md) `E`
  - [Convert Sorted Array to Binary Search Tree](./Week-02/Day-010_Binary-Trees-and-BST/Convert-Sorted-Array-to-Binary-Search-Tree/understanding.md) `E`
  - [Range Sum of BST](./Week-02/Day-010_Binary-Trees-and-BST/Range-Sum-of-BST/understanding.md) `E`
- **Day 11 — Strings** (0/6 solved):
  - [Valid Palindrome](./Week-02/Day-011_Strings/Valid-Palindrome/understanding.md) `E`
  - [Valid Palindrome II](./Week-02/Day-011_Strings/Valid-Palindrome-II/understanding.md) `E`
  - [Longest Palindrome](./Week-02/Day-011_Strings/Longest-Palindrome/understanding.md) `E`
  - [Longest Common Prefix](./Week-02/Day-011_Strings/Longest-Common-Prefix/understanding.md) `E`
  - [Valid Anagram](./Week-02/Day-011_Strings/Valid-Anagram/understanding.md) `E`
  - [First Unique Character in a String](./Week-02/Day-011_Strings/First-Unique-Character-in-a-String/understanding.md) `E`
- **Day 12 — Strings** (0/6 solved):
  - [Is Subsequence](./Week-02/Day-012_Strings/Is-Subsequence/understanding.md) `E`
  - [Reverse String](./Week-02/Day-012_Strings/Reverse-String/understanding.md) `E`
  - [Reverse String II](./Week-02/Day-012_Strings/Reverse-String-II/understanding.md) `E`
  - [Reverse Words in a String III](./Week-02/Day-012_Strings/Reverse-Words-in-a-String-III/understanding.md) `E`
  - [Isomorphic Strings](./Week-02/Day-012_Strings/Isomorphic-Strings/understanding.md) `E`
  - [Remove All Adjacent Duplicates In String](./Week-02/Day-012_Strings/Remove-All-Adjacent-Duplicates-In-String/understanding.md) `E`
- **Day 13 — Strings** (0/6 solved):
  - [Defanging an IP Address](./Week-02/Day-013_Strings/Defanging-an-IP-Address/understanding.md) `E`
  - [Reverse Only Letters](./Week-02/Day-013_Strings/Reverse-Only-Letters/understanding.md) `E`
  - [Reverse Vowels of a String](./Week-02/Day-013_Strings/Reverse-Vowels-of-a-String/understanding.md) `E`
  - [Length of Last Word](./Week-02/Day-013_Strings/Length-of-Last-Word/understanding.md) `E`
  - [Add Strings](./Week-02/Day-013_Strings/Add-Strings/understanding.md) `E`
  - [Fizz Buzz](./Week-02/Day-013_Strings/Fizz-Buzz/understanding.md) `E`
- **Day 14 — System Design & OOD** (0/2 solved):
  - [Design Consistent Hashing](./Week-02/Day-014_System-Design-and-OOD/Design-Consistent-Hashing/understanding.md) `System Design`
  - [Design a Parking Lot](./Week-02/Day-014_System-Design-and-OOD/Design-a-Parking-Lot/understanding.md) `OOD Design`

</details>

<details>
<summary><strong>Week 3 (Days 15–21)</strong> — Phase 1: DSA Foundations & Core Structures (0/35 solved · 7 days)</summary>

- **Day 15 (Revision):** [Revise questions solved from Day 1 to 14](./Week-03/Day-015_Revision/README.md)
- **Day 16 — Math** (0/6 solved):
  - [Roman to Integer](./Week-03/Day-016_Math/Roman-to-Integer/understanding.md) `E`
  - [Palindrome Number](./Week-03/Day-016_Math/Palindrome-Number/understanding.md) `E`
  - [Happy Number](./Week-03/Day-016_Math/Happy-Number/understanding.md) `E`
  - [Power of Two](./Week-03/Day-016_Math/Power-of-Two/understanding.md) `E`
  - [Sqrt(x)](./Week-03/Day-016_Math/Sqrtx/understanding.md) `E`
  - [Plus One](./Week-03/Day-016_Math/Plus-One/understanding.md) `E`
- **Day 17 — Math & Geometry** (0/5 solved):
  - [Count Odd Numbers in an Interval Range](./Week-03/Day-017_Math-and-Geometry/Count-Odd-Numbers-in-an-Interval-Range/understanding.md) `E`
  - [Rectangle Overlap](./Week-03/Day-017_Math-and-Geometry/Rectangle-Overlap/understanding.md) `E`
  - [Add Digits](./Week-03/Day-017_Math-and-Geometry/Add-Digits/understanding.md) `E`
  - [Maximum Product of Three Numbers](./Week-03/Day-017_Math-and-Geometry/Maximum-Product-of-Three-Numbers/understanding.md) `E`
  - [Excel Sheet Column Number](./Week-03/Day-017_Math-and-Geometry/Excel-Sheet-Column-Number/understanding.md) `E`
- **Day 18 — Bit Manipulation** (0/7 solved):
  - [Add Binary](./Week-03/Day-018_Bit-Manipulation/Add-Binary/understanding.md) `E`
  - [Counting Bits](./Week-03/Day-018_Bit-Manipulation/Counting-Bits/understanding.md) `E`
  - [Number of 1 Bits](./Week-03/Day-018_Bit-Manipulation/Number-of-1-Bits/understanding.md) `E`
  - [Single Number](./Week-03/Day-018_Bit-Manipulation/Single-Number/understanding.md) `E`
  - [Missing Number](./Week-03/Day-018_Bit-Manipulation/Missing-Number/understanding.md) `E`
  - [Reverse Bits](./Week-03/Day-018_Bit-Manipulation/Reverse-Bits/understanding.md) `E`
  - [Hamming Distance](./Week-03/Day-018_Bit-Manipulation/Hamming-Distance/understanding.md) `E`
- **Day 19 — Binary Search** (0/6 solved):
  - [Binary Search](./Week-03/Day-019_Binary-Search/Binary-Search/understanding.md) `E`
  - [Search Insert Position](./Week-03/Day-019_Binary-Search/Search-Insert-Position/understanding.md) `E`
  - [First Bad Version](./Week-03/Day-019_Binary-Search/First-Bad-Version/understanding.md) `E`
  - [Valid Perfect Square](./Week-03/Day-019_Binary-Search/Valid-Perfect-Square/understanding.md) `E`
  - [Kth Missing Positive Number](./Week-03/Day-019_Binary-Search/Kth-Missing-Positive-Number/understanding.md) `E`
  - [Kth Largest Element in a Stream](./Week-03/Day-019_Binary-Search/Kth-Largest-Element-in-a-Stream/understanding.md) `E`
- **Day 20 — Hashing & Hash Table** (0/6 solved):
  - [Design HashMap](./Week-03/Day-020_Hashing-and-Hash-Table/Design-HashMap/understanding.md) `E`
  - [Ransom Note](./Week-03/Day-020_Hashing-and-Hash-Table/Ransom-Note/understanding.md) `E`
  - [Contains Duplicate](./Week-03/Day-020_Hashing-and-Hash-Table/Contains-Duplicate/understanding.md) `E`
  - [Contains Duplicate II](./Week-03/Day-020_Hashing-and-Hash-Table/Contains-Duplicate-II/understanding.md) `E`
  - [Jewels and Stones](./Week-03/Day-020_Hashing-and-Hash-Table/Jewels-and-Stones/understanding.md) `E`
  - [Unique Number of Occurrences](./Week-03/Day-020_Hashing-and-Hash-Table/Unique-Number-of-Occurrences/understanding.md) `E`
- **Day 21 — Hashing & Graphs Intro** (0/5 solved):
  - [Word Pattern](./Week-03/Day-021_Hashing-and-Graphs-Intro/Word-Pattern/understanding.md) `E`
  - [Number of Good Pairs](./Week-03/Day-021_Hashing-and-Graphs-Intro/Number-of-Good-Pairs/understanding.md) `E`
  - [Flood Fill](./Week-03/Day-021_Hashing-and-Graphs-Intro/Flood-Fill/understanding.md) `E`
  - [Island Perimeter](./Week-03/Day-021_Hashing-and-Graphs-Intro/Island-Perimeter/understanding.md) `E`
  - [Find if Path Exists in Graph](./Week-03/Day-021_Hashing-and-Graphs-Intro/Find-if-Path-Exists-in-Graph/understanding.md) `E`

</details>

<details>
<summary><strong>Week 4 (Days 22–28)</strong> — Phase 2: Core Patterns, Two Pointers & Stacks (0/28 solved · 7 days)</summary>

- **Day 22 — System Design & OOD** (0/2 solved):
  - [Design A Key-value Store](./Week-04/Day-022_System-Design-and-OOD/Design-A-Key-value-Store/understanding.md) `System Design`
  - [Design Amazon - Online Shopping System](./Week-04/Day-022_System-Design-and-OOD/Design-Amazon-Online-Shopping-System/understanding.md) `OOD Design`
- **Day 23 — Dynamic Programming & Greedy Intro** (0/6 solved):
  - [Fibonacci Number](./Week-04/Day-023_Dynamic-Programming-and-Greedy-Intro/Fibonacci-Number/understanding.md) `E`
  - [Min Cost Climbing Stairs](./Week-04/Day-023_Dynamic-Programming-and-Greedy-Intro/Min-Cost-Climbing-Stairs/understanding.md) `E`
  - [Climbing Stairs](./Week-04/Day-023_Dynamic-Programming-and-Greedy-Intro/Climbing-Stairs/understanding.md) `E`
  - [Pascal's Triangle](./Week-04/Day-023_Dynamic-Programming-and-Greedy-Intro/Pascals-Triangle/understanding.md) `E`
  - [Can Place Flowers](./Week-04/Day-023_Dynamic-Programming-and-Greedy-Intro/Can-Place-Flowers/understanding.md) `E`
  - [Maximum Units on a Truck](./Week-04/Day-023_Dynamic-Programming-and-Greedy-Intro/Maximum-Units-on-a-Truck/understanding.md) `E`
- **Day 24 — Arrays & Two Pointers** (0/4 solved):
  - [3Sum](./Week-04/Day-024_Arrays-and-Two-Pointers/3Sum/understanding.md) `M`
  - [3Sum Closest](./Week-04/Day-024_Arrays-and-Two-Pointers/3Sum-Closest/understanding.md) `M`
  - [Non-decreasing Array](./Week-04/Day-024_Arrays-and-Two-Pointers/Non-decreasing-Array/understanding.md) `M`
  - [Product of Array Except Self](./Week-04/Day-024_Arrays-and-Two-Pointers/Product-of-Array-Except-Self/understanding.md) `M`
- **Day 25 — Intervals** (0/4 solved):
  - [Merge Intervals](./Week-04/Day-025_Intervals/Merge-Intervals/understanding.md) `M`
  - [Insert Interval](./Week-04/Day-025_Intervals/Insert-Interval/understanding.md) `M`
  - [Non-overlapping Intervals](./Week-04/Day-025_Intervals/Non-overlapping-Intervals/understanding.md) `M`
  - [Interval List Intersections](./Week-04/Day-025_Intervals/Interval-List-Intersections/understanding.md) `M`
- **Day 26 — Two Pointers & Arrays** (0/4 solved):
  - [Container With Most Water](./Week-04/Day-026_Two-Pointers-and-Arrays/Container-With-Most-Water/understanding.md) `M`
  - [Sort Colors](./Week-04/Day-026_Two-Pointers-and-Arrays/Sort-Colors/understanding.md) `M`
  - [Rotate Array](./Week-04/Day-026_Two-Pointers-and-Arrays/Rotate-Array/understanding.md) `M`
  - [Contiguous Array](./Week-04/Day-026_Two-Pointers-and-Arrays/Contiguous-Array/understanding.md) `M`
- **Day 27 — Prefix Sum & Sliding Window** (0/4 solved):
  - [Subarray Sum Equals K](./Week-04/Day-027_Prefix-Sum-and-Sliding-Window/Subarray-Sum-Equals-K/understanding.md) `M`
  - [Shortest Unsorted Continuous Subarray](./Week-04/Day-027_Prefix-Sum-and-Sliding-Window/Shortest-Unsorted-Continuous-Subarray/understanding.md) `M`
  - [Maximum Points You Can Obtain from Cards](./Week-04/Day-027_Prefix-Sum-and-Sliding-Window/Maximum-Points-You-Can-Obtain-from-Cards/understanding.md) `M`
  - [Max Consecutive Ones III](./Week-04/Day-027_Prefix-Sum-and-Sliding-Window/Max-Consecutive-Ones-III/understanding.md) `M`
- **Day 28 — Sliding Window & Arrays** (0/4 solved):
  - [Permutation in String](./Week-04/Day-028_Sliding-Window-and-Arrays/Permutation-in-String/understanding.md) `M`
  - [Wiggle Sort II](./Week-04/Day-028_Sliding-Window-and-Arrays/Wiggle-Sort-II/understanding.md) `M`
  - [Max Chunks To Make Sorted](./Week-04/Day-028_Sliding-Window-and-Arrays/Max-Chunks-To-Make-Sorted/understanding.md) `M`
  - [H-Index](./Week-04/Day-028_Sliding-Window-and-Arrays/H-Index/understanding.md) `M`

</details>

<details>
<summary><strong>Week 5 (Days 29–35)</strong> — Phase 2: Core Patterns, Two Pointers & Stacks (0/20 solved · 7 days)</summary>

- **Day 29 — System Design & OOD** (0/2 solved):
  - [Design A Distributed Unique ID Generator](./Week-05/Day-029_System-Design-and-OOD/Design-A-Distributed-Unique-ID-Generator/understanding.md) `System Design`
  - [Design Stack Overflow](./Week-05/Day-029_System-Design-and-OOD/Design-Stack-Overflow/understanding.md) `OOD Design`
- **Day 30 (Revision):** [Revise questions solved from Day 15 to 29](./Week-05/Day-030_Revision/README.md)
- **Day 31 — Linked List** (0/4 solved):
  - [Remove Nth Node From End of List](./Week-05/Day-031_Linked-List/Remove-Nth-Node-From-End-of-List/understanding.md) `M`
  - [Delete Node in a Linked List](./Week-05/Day-031_Linked-List/Delete-Node-in-a-Linked-List/understanding.md) `M`
  - [Remove Duplicates from Sorted List II](./Week-05/Day-031_Linked-List/Remove-Duplicates-from-Sorted-List-II/understanding.md) `M`
  - [Next Greater Node In Linked List](./Week-05/Day-031_Linked-List/Next-Greater-Node-In-Linked-List/understanding.md) `M`
- **Day 32 — Linked List** (0/4 solved):
  - [Add Two Numbers](./Week-05/Day-032_Linked-List/Add-Two-Numbers/understanding.md) `M`
  - [Add Two Numbers II](./Week-05/Day-032_Linked-List/Add-Two-Numbers-II/understanding.md) `M`
  - [Copy List with Random Pointer](./Week-05/Day-032_Linked-List/Copy-List-with-Random-Pointer/understanding.md) `M`
  - [Reverse Linked List II](./Week-05/Day-032_Linked-List/Reverse-Linked-List-II/understanding.md) `M`
- **Day 33 — Linked List** (0/3 solved):
  - [Swap Nodes in Pairs](./Week-05/Day-033_Linked-List/Swap-Nodes-in-Pairs/understanding.md) `M`
  - [Odd Even Linked List](./Week-05/Day-033_Linked-List/Odd-Even-Linked-List/understanding.md) `M`
  - [Partition List](./Week-05/Day-033_Linked-List/Partition-List/understanding.md) `M`
- **Day 34 — Linked List** (0/3 solved):
  - [Sort List](./Week-05/Day-034_Linked-List/Sort-List/understanding.md) `M`
  - [Reorder List](./Week-05/Day-034_Linked-List/Reorder-List/understanding.md) `M`
  - [Rotate List](./Week-05/Day-034_Linked-List/Rotate-List/understanding.md) `M`
- **Day 35 — Stack** (0/4 solved):
  - [Evaluate Reverse Polish Notation](./Week-05/Day-035_Stack/Evaluate-Reverse-Polish-Notation/understanding.md) `M`
  - [Min Stack](./Week-05/Day-035_Stack/Min-Stack/understanding.md) `M`
  - [Daily Temperatures](./Week-05/Day-035_Stack/Daily-Temperatures/understanding.md) `M`
  - [Decode String](./Week-05/Day-035_Stack/Decode-String/understanding.md) `M`

</details>

<details>
<summary><strong>Week 6 (Days 36–42)</strong> — Phase 2: Core Patterns, Two Pointers & Stacks (0/26 solved · 7 days)</summary>

- **Day 36 — Stack (Monotonic)** (0/4 solved):
  - [Next Greater Element II](./Week-06/Day-036_Stack-Monotonic/Next-Greater-Element-II/understanding.md) `M`
  - [Next Greater Element III](./Week-06/Day-036_Stack-Monotonic/Next-Greater-Element-III/understanding.md) `M`
  - [Minimum Remove to Make Valid Parentheses](./Week-06/Day-036_Stack-Monotonic/Minimum-Remove-to-Make-Valid-Parentheses/understanding.md) `M`
  - [132 Pattern](./Week-06/Day-036_Stack-Monotonic/132-Pattern/understanding.md) `M`
- **Day 37 — System Design & OOD** (0/2 solved):
  - [Design A URL Shortener](./Week-06/Day-037_System-Design-and-OOD/Design-A-URL-Shortener/understanding.md) `System Design`
  - [Design a Movie Ticket Booking System](./Week-06/Day-037_System-Design-and-OOD/Design-a-Movie-Ticket-Booking-System/understanding.md) `OOD Design`
- **Day 38 — Stack** (0/4 solved):
  - [Asteroid Collision](./Week-06/Day-038_Stack/Asteroid-Collision/understanding.md) `M`
  - [Basic Calculator II](./Week-06/Day-038_Stack/Basic-Calculator-II/understanding.md) `M`
  - [Remove K Digits](./Week-06/Day-038_Stack/Remove-K-Digits/understanding.md) `M`
  - [Remove Duplicate Letters](./Week-06/Day-038_Stack/Remove-Duplicate-Letters/understanding.md) `M`
- **Day 39 — Stack** (0/4 solved):
  - [Remove All Adjacent Duplicates in String II](./Week-06/Day-039_Stack/Remove-All-Adjacent-Duplicates-in-String-II/understanding.md) `M`
  - [Flatten Nested List Iterator](./Week-06/Day-039_Stack/Flatten-Nested-List-Iterator/understanding.md) `M`
  - [Simplify Path](./Week-06/Day-039_Stack/Simplify-Path/understanding.md) `M`
  - [Longest Absolute File Path](./Week-06/Day-039_Stack/Longest-Absolute-File-Path/understanding.md) `M`
- **Day 40 — BFS & Cache** (0/3 solved):
  - [Open the Lock](./Week-06/Day-040_BFS-and-Cache/Open-the-Lock/understanding.md) `M`
  - [Shortest Bridge](./Week-06/Day-040_BFS-and-Cache/Shortest-Bridge/understanding.md) `M`
  - [LRU Cache](./Week-06/Day-040_BFS-and-Cache/LRU-Cache/understanding.md) `M`
- **Day 41 — Strings & Window** (0/5 solved):
  - [Longest Substring Without Repeating Characters](./Week-06/Day-041_Strings-and-Window/Longest-Substring-Without-Repeating-Characters/understanding.md) `M`
  - [String to Integer (atoi)](./Week-06/Day-041_Strings-and-Window/String-to-Integer-atoi/understanding.md) `M`
  - [Find All Anagrams in a String](./Week-06/Day-041_Strings-and-Window/Find-All-Anagrams-in-a-String/understanding.md) `M`
  - [Group Anagrams](./Week-06/Day-041_Strings-and-Window/Group-Anagrams/understanding.md) `M`
  - [Pancake Sorting](./Week-06/Day-041_Strings-and-Window/Pancake-Sorting/understanding.md) `M`
- **Day 42 — Strings** (0/4 solved):
  - [Longest Repeating Character Replacement](./Week-06/Day-042_Strings/Longest-Repeating-Character-Replacement/understanding.md) `M`
  - [Largest Number](./Week-06/Day-042_Strings/Largest-Number/understanding.md) `M`
  - [Number of Matching Subsequences](./Week-06/Day-042_Strings/Number-of-Matching-Subsequences/understanding.md) `M`
  - [Find the Index of the First Occurrence in a String](./Week-06/Day-042_Strings/Find-the-Index-of-the-First-Occurrence-in-a-String/understanding.md) `M`

</details>

<details>
<summary><strong>Week 7 (Days 43–49)</strong> — Phase 2: Core Patterns, Two Pointers & Stacks (0/23 solved · 7 days)</summary>

- **Day 43 — Strings** (0/5 solved):
  - [Longest Substring with At Least K Repeating Characters](./Week-07/Day-043_Strings/Longest-Substring-with-At-Least-K-Repeating-Characters/understanding.md) `M`
  - [Zigzag Conversion](./Week-07/Day-043_Strings/Zigzag-Conversion/understanding.md) `M`
  - [Reverse Words in a String](./Week-07/Day-043_Strings/Reverse-Words-in-a-String/understanding.md) `M`
  - [String Compression](./Week-07/Day-043_Strings/String-Compression/understanding.md) `M`
  - [Count and Say](./Week-07/Day-043_Strings/Count-and-Say/understanding.md) `M`
- **Day 44 — System Design & OOD** (0/2 solved):
  - [Design Pastebin](./Week-07/Day-044_System-Design-and-OOD/Design-Pastebin/understanding.md) `System Design`
  - [Design an ATM](./Week-07/Day-044_System-Design-and-OOD/Design-an-ATM/understanding.md) `OOD Design`
- **Day 45 (Revision):** [Revise questions solved from Day 30 to 44](./Week-07/Day-045_Revision/README.md)
- **Day 46 — Trees (Level Order & Ancestor)** (0/4 solved):
  - [Binary Tree Level Order Traversal](./Week-07/Day-046_Trees-Level-Order-and-Ancestor/Binary-Tree-Level-Order-Traversal/understanding.md) `M`
  - [Binary Tree Zigzag Level Order Traversal](./Week-07/Day-046_Trees-Level-Order-and-Ancestor/Binary-Tree-Zigzag-Level-Order-Traversal/understanding.md) `M`
  - [Construct Binary Tree from Preorder and Inorder Traversal](./Week-07/Day-046_Trees-Level-Order-and-Ancestor/Construct-Binary-Tree-from-Preorder-and-Inorder-Traversal/understanding.md) `M`
  - [Lowest Common Ancestor of a Binary Tree](./Week-07/Day-046_Trees-Level-Order-and-Ancestor/Lowest-Common-Ancestor-of-a-Binary-Tree/understanding.md) `M`
- **Day 47 — Trees (Views & Pointers)** (0/4 solved):
  - [Binary Tree Right Side View](./Week-07/Day-047_Trees-Views-and-Pointers/Binary-Tree-Right-Side-View/understanding.md) `M`
  - [Populating Next Right Pointers in Each Node](./Week-07/Day-047_Trees-Views-and-Pointers/Populating-Next-Right-Pointers-in-Each-Node/understanding.md) `M`
  - [Populating Next Right Pointers in Each Node II](./Week-07/Day-047_Trees-Views-and-Pointers/Populating-Next-Right-Pointers-in-Each-Node-II/understanding.md) `M`
  - [Maximum Width of Binary Tree](./Week-07/Day-047_Trees-Views-and-Pointers/Maximum-Width-of-Binary-Tree/understanding.md) `M`
- **Day 48 — Trees (Path & Distance)** (0/4 solved):
  - [Path Sum II](./Week-07/Day-048_Trees-Path-and-Distance/Path-Sum-II/understanding.md) `M`
  - [Path Sum III](./Week-07/Day-048_Trees-Path-and-Distance/Path-Sum-III/understanding.md) `M`
  - [All Nodes Distance K in Binary Tree](./Week-07/Day-048_Trees-Path-and-Distance/All-Nodes-Distance-K-in-Binary-Tree/understanding.md) `M`
  - [Flatten Binary Tree to Linked List](./Week-07/Day-048_Trees-Path-and-Distance/Flatten-Binary-Tree-to-Linked-List/understanding.md) `M`
- **Day 49 — Trees (Counting & Coins)** (0/4 solved):
  - [Count Complete Tree Nodes](./Week-07/Day-049_Trees-Counting-and-Coins/Count-Complete-Tree-Nodes/understanding.md) `M`
  - [Sum Root to Leaf Numbers](./Week-07/Day-049_Trees-Counting-and-Coins/Sum-Root-to-Leaf-Numbers/understanding.md) `M`
  - [Find Bottom Left Tree Value](./Week-07/Day-049_Trees-Counting-and-Coins/Find-Bottom-Left-Tree-Value/understanding.md) `M`
  - [Distribute Coins in Binary Tree](./Week-07/Day-049_Trees-Counting-and-Coins/Distribute-Coins-in-Binary-Tree/understanding.md) `M`

</details>

<details>
<summary><strong>Week 8 (Days 50–56)</strong> — Phase 3: Trees, Binary Search, Graphs & 1D DP (0/24 solved · 7 days)</summary>

- **Day 50 — BST Operations** (0/4 solved):
  - [Delete Node in a BST](./Week-08/Day-050_BST-Operations/Delete-Node-in-a-BST/understanding.md) `M`
  - [Validate Binary Search Tree](./Week-08/Day-050_BST-Operations/Validate-Binary-Search-Tree/understanding.md) `M`
  - [Kth Smallest Element in a BST](./Week-08/Day-050_BST-Operations/Kth-Smallest-Element-in-a-BST/understanding.md) `M`
  - [Lowest Common Ancestor of a Binary Search Tree](./Week-08/Day-050_BST-Operations/Lowest-Common-Ancestor-of-a-Binary-Search-Tree/understanding.md) `M`
- **Day 51 — BST Conversion & Iterator** (0/4 solved):
  - [Convert Sorted List to Binary Search Tree](./Week-08/Day-051_BST-Conversion-and-Iterator/Convert-Sorted-List-to-Binary-Search-Tree/understanding.md) `M`
  - [Construct Binary Search Tree from Preorder Traversal](./Week-08/Day-051_BST-Conversion-and-Iterator/Construct-Binary-Search-Tree-from-Preorder-Traversal/understanding.md) `M`
  - [Binary Search Tree Iterator](./Week-08/Day-051_BST-Conversion-and-Iterator/Binary-Search-Tree-Iterator/understanding.md) `M`
  - [Recover Binary Search Tree](./Week-08/Day-051_BST-Conversion-and-Iterator/Recover-Binary-Search-Tree/understanding.md) `M`
- **Day 52 — System Design & OOD** (0/2 solved):
  - [Design Instagram](./Week-08/Day-052_System-Design-and-OOD/Design-Instagram/understanding.md) `System Design`
  - [Design an Airline Management System](./Week-08/Day-052_System-Design-and-OOD/Design-an-Airline-Management-System/understanding.md) `OOD Design`
- **Day 53 — Trees (Advanced)** (0/3 solved):
  - [Binary Tree Maximum Path Sum](./Week-08/Day-053_Trees-Advanced/Binary-Tree-Maximum-Path-Sum/understanding.md) `H`
  - [Step-By-Step Directions From a Binary Tree Node to Another](./Week-08/Day-053_Trees-Advanced/Step-By-Step-Directions-From-a-Binary-Tree-Node-to-Another/understanding.md) `M`
  - [Maximum Level Sum of a Binary Tree](./Week-08/Day-053_Trees-Advanced/Maximum-Level-Sum-of-a-Binary-Tree/understanding.md) `M`
- **Day 54 — Trees (Serialization & BST)** (0/3 solved):
  - [Trim a Binary Search Tree](./Week-08/Day-054_Trees-Serialization-and-BST/Trim-a-Binary-Search-Tree/understanding.md) `M`
  - [Balance a Binary Search Tree](./Week-08/Day-054_Trees-Serialization-and-BST/Balance-a-Binary-Search-Tree/understanding.md) `M`
  - [Serialize and Deserialize Binary Tree](./Week-08/Day-054_Trees-Serialization-and-BST/Serialize-and-Deserialize-Binary-Tree/understanding.md) `H`
- **Day 55 — Binary Search (Rotated)** (0/4 solved):
  - [Search in Rotated Sorted Array](./Week-08/Day-055_Binary-Search-Rotated/Search-in-Rotated-Sorted-Array/understanding.md) `M`
  - [Search in Rotated Sorted Array II](./Week-08/Day-055_Binary-Search-Rotated/Search-in-Rotated-Sorted-Array-II/understanding.md) `M`
  - [Time Based Key-Value Store](./Week-08/Day-055_Binary-Search-Rotated/Time-Based-Key-Value-Store/understanding.md) `M`
  - [Find Minimum in Rotated Sorted Array](./Week-08/Day-055_Binary-Search-Rotated/Find-Minimum-in-Rotated-Sorted-Array/understanding.md) `M`
- **Day 56 — Binary Search & Arrays** (0/4 solved):
  - [Find First and Last Position of Element in Sorted Array](./Week-08/Day-056_Binary-Search-and-Arrays/Find-First-and-Last-Position-of-Element-in-Sorted-Array/understanding.md) `M`
  - [Find the Duplicate Number](./Week-08/Day-056_Binary-Search-and-Arrays/Find-the-Duplicate-Number/understanding.md) `M`
  - [Minimum Size Subarray Sum](./Week-08/Day-056_Binary-Search-and-Arrays/Minimum-Size-Subarray-Sum/understanding.md) `M`
  - [Single Element in a Sorted Array](./Week-08/Day-056_Binary-Search-and-Arrays/Single-Element-in-a-Sorted-Array/understanding.md) `M`

</details>

<details>
<summary><strong>Week 9 (Days 57–63)</strong> — Phase 3: Trees, Binary Search, Graphs & 1D DP (0/22 solved · 7 days)</summary>

- **Day 57 — Binary Search on Answer** (0/4 solved):
  - [Find Peak Element](./Week-09/Day-057_Binary-Search-on-Answer/Find-Peak-Element/understanding.md) `M`
  - [Capacity To Ship Packages Within D Days](./Week-09/Day-057_Binary-Search-on-Answer/Capacity-To-Ship-Packages-Within-D-Days/understanding.md) `M`
  - [Koko Eating Bananas](./Week-09/Day-057_Binary-Search-on-Answer/Koko-Eating-Bananas/understanding.md) `M`
  - [Peak Index in a Mountain Array](./Week-09/Day-057_Binary-Search-on-Answer/Peak-Index-in-a-Mountain-Array/understanding.md) `M`
- **Day 58 — Matrix & 2D Search** (0/4 solved):
  - [Search a 2D Matrix](./Week-09/Day-058_Matrix-and-2D-Search/Search-a-2D-Matrix/understanding.md) `M`
  - [Search a 2D Matrix II](./Week-09/Day-058_Matrix-and-2D-Search/Search-a-2D-Matrix-II/understanding.md) `M`
  - [Spiral Matrix](./Week-09/Day-058_Matrix-and-2D-Search/Spiral-Matrix/understanding.md) `M`
  - [Spiral Matrix II](./Week-09/Day-058_Matrix-and-2D-Search/Spiral-Matrix-II/understanding.md) `M`
- **Day 59 — System Design & OOD** (0/2 solved):
  - [Design A Web Crawler](./Week-09/Day-059_System-Design-and-OOD/Design-A-Web-Crawler/understanding.md) `System Design`
  - [Design Blackjack and a Deck of Cards](./Week-09/Day-059_System-Design-and-OOD/Design-Blackjack-and-a-Deck-of-Cards/understanding.md) `OOD Design`
- **Day 60 (Revision):** [Revise questions solved from Day 46 to 59](./Week-09/Day-060_Revision/README.md)
- **Day 61 — Matrix Simulation** (0/4 solved):
  - [Valid Sudoku](./Week-09/Day-061_Matrix-Simulation/Valid-Sudoku/understanding.md) `M`
  - [Rotate Image](./Week-09/Day-061_Matrix-Simulation/Rotate-Image/understanding.md) `M`
  - [Set Matrix Zeroes](./Week-09/Day-061_Matrix-Simulation/Set-Matrix-Zeroes/understanding.md) `M`
  - [Game of Life](./Week-09/Day-061_Matrix-Simulation/Game-of-Life/understanding.md) `M`
- **Day 62 — Matrix & Arrays** (0/4 solved):
  - [Diagonal Traverse](./Week-09/Day-062_Matrix-and-Arrays/Diagonal-Traverse/understanding.md) `M`
  - [Matrix Block Sum](./Week-09/Day-062_Matrix-and-Arrays/Matrix-Block-Sum/understanding.md) `M`
  - [Battleships in a Board](./Week-09/Day-062_Matrix-and-Arrays/Battleships-in-a-Board/understanding.md) `M`
  - [Snapshot Array](./Week-09/Day-062_Matrix-and-Arrays/Snapshot-Array/understanding.md) `M`
- **Day 63 — Graphs (BFS/DFS Basics)** (0/4 solved):
  - [Number of Islands](./Week-09/Day-063_Graphs-BFS-DFS-Basics/Number-of-Islands/understanding.md) `M`
  - [01 Matrix](./Week-09/Day-063_Graphs-BFS-DFS-Basics/01-Matrix/understanding.md) `M`
  - [Clone Graph](./Week-09/Day-063_Graphs-BFS-DFS-Basics/Clone-Graph/understanding.md) `M`
  - [Rotting Oranges](./Week-09/Day-063_Graphs-BFS-DFS-Basics/Rotting-Oranges/understanding.md) `M`

</details>

<details>
<summary><strong>Week 10 (Days 64–70)</strong> — Phase 3: Trees, Binary Search, Graphs & 1D DP (0/26 solved · 7 days)</summary>

- **Day 64 — Graphs (Topological & DFS)** (0/4 solved):
  - [Course Schedule](./Week-10/Day-064_Graphs-Topological-and-DFS/Course-Schedule/understanding.md) `M`
  - [Course Schedule II](./Week-10/Day-064_Graphs-Topological-and-DFS/Course-Schedule-II/understanding.md) `M`
  - [Accounts Merge](./Week-10/Day-064_Graphs-Topological-and-DFS/Accounts-Merge/understanding.md) `M`
  - [Word Search](./Week-10/Day-064_Graphs-Topological-and-DFS/Word-Search/understanding.md) `M`
- **Day 65 — Graphs (Shortest Path & DFS)** (0/4 solved):
  - [Minimum Height Trees](./Week-10/Day-065_Graphs-Shortest-Path-and-DFS/Minimum-Height-Trees/understanding.md) `M`
  - [Pacific Atlantic Water Flow](./Week-10/Day-065_Graphs-Shortest-Path-and-DFS/Pacific-Atlantic-Water-Flow/understanding.md) `M`
  - [Cheapest Flights Within K Stops](./Week-10/Day-065_Graphs-Shortest-Path-and-DFS/Cheapest-Flights-Within-K-Stops/understanding.md) `M`
  - [Max Area of Island](./Week-10/Day-065_Graphs-Shortest-Path-and-DFS/Max-Area-of-Island/understanding.md) `M`
- **Day 66 — Graphs (Union Find & Dijkstra)** (0/4 solved):
  - [Evaluate Division](./Week-10/Day-066_Graphs-Union-Find-and-Dijkstra/Evaluate-Division/understanding.md) `M`
  - [Number of Provinces](./Week-10/Day-066_Graphs-Union-Find-and-Dijkstra/Number-of-Provinces/understanding.md) `M`
  - [Surrounded Regions](./Week-10/Day-066_Graphs-Union-Find-and-Dijkstra/Surrounded-Regions/understanding.md) `M`
  - [Network Delay Time](./Week-10/Day-066_Graphs-Union-Find-and-Dijkstra/Network-Delay-Time/understanding.md) `M`
- **Day 67 — System Design & OOD** (0/2 solved):
  - [Design A Notification System](./Week-10/Day-067_System-Design-and-OOD/Design-A-Notification-System/understanding.md) `System Design`
  - [Design a Hotel Management System](./Week-10/Day-067_System-Design-and-OOD/Design-a-Hotel-Management-System/understanding.md) `OOD Design`
- **Day 68 — Graphs (Paths & Connectivity)** (0/4 solved):
  - [All Paths From Source to Target](./Week-10/Day-068_Graphs-Paths-and-Connectivity/All-Paths-From-Source-to-Target/understanding.md) `M`
  - [Redundant Connection](./Week-10/Day-068_Graphs-Paths-and-Connectivity/Redundant-Connection/understanding.md) `M`
  - [Shortest Path in Binary Matrix](./Week-10/Day-068_Graphs-Paths-and-Connectivity/Shortest-Path-in-Binary-Matrix/understanding.md) `M`
  - [Number of Operations to Make Network Connected](./Week-10/Day-068_Graphs-Paths-and-Connectivity/Number-of-Operations-to-Make-Network-Connected/understanding.md) `M`
- **Day 69 — Hashing & Array** (0/4 solved):
  - [Majority Element II](./Week-10/Day-069_Hashing-and-Array/Majority-Element-II/understanding.md) `M`
  - [Longest Consecutive Sequence](./Week-10/Day-069_Hashing-and-Array/Longest-Consecutive-Sequence/understanding.md) `M`
  - [Insert Delete GetRandom O(1)](./Week-10/Day-069_Hashing-and-Array/Insert-Delete-GetRandom-O1/understanding.md) `M`
  - [Find All Duplicates in an Array](./Week-10/Day-069_Hashing-and-Array/Find-All-Duplicates-in-an-Array/understanding.md) `M`
- **Day 70 — Subarrays & Hashing** (0/4 solved):
  - [Continuous Subarray Sum](./Week-10/Day-070_Subarrays-and-Hashing/Continuous-Subarray-Sum/understanding.md) `M`
  - [Find and Replace Pattern](./Week-10/Day-070_Subarrays-and-Hashing/Find-and-Replace-Pattern/understanding.md) `M`
  - [K-diff Pairs in an Array](./Week-10/Day-070_Subarrays-and-Hashing/K-diff-Pairs-in-an-Array/understanding.md) `M`
  - [Custom Sort String](./Week-10/Day-070_Subarrays-and-Hashing/Custom-Sort-String/understanding.md) `M`

</details>

<details>
<summary><strong>Week 11 (Days 71–77)</strong> — Phase 3: Trees, Binary Search, Graphs & 1D DP (0/22 solved · 7 days)</summary>

- **Day 71 — Math & Sliding Window** (0/4 solved):
  - [Fraction to Recurring Decimal](./Week-11/Day-071_Math-and-Sliding-Window/Fraction-to-Recurring-Decimal/understanding.md) `M`
  - [Fruit Into Baskets](./Week-11/Day-071_Math-and-Sliding-Window/Fruit-Into-Baskets/understanding.md) `M`
  - [Encode and Decode TinyURL](./Week-11/Day-071_Math-and-Sliding-Window/Encode-and-Decode-TinyURL/understanding.md) `M`
  - [Minimum Area Rectangle](./Week-11/Day-071_Math-and-Sliding-Window/Minimum-Area-Rectangle/understanding.md) `M`
- **Day 72 — Dynamic Programming (1D & Knapsack)** (0/4 solved):
  - [Maximum Subarray](./Week-11/Day-072_Dynamic-Programming-1D-and-Knapsack/Maximum-Subarray/understanding.md) `M`
  - [Maximum Product Subarray](./Week-11/Day-072_Dynamic-Programming-1D-and-Knapsack/Maximum-Product-Subarray/understanding.md) `M`
  - [Coin Change](./Week-11/Day-072_Dynamic-Programming-1D-and-Knapsack/Coin-Change/understanding.md) `M`
  - [Coin Change II](./Week-11/Day-072_Dynamic-Programming-1D-and-Knapsack/Coin-Change-II/understanding.md) `M`
- **Day 73 — Dynamic Programming & Greedy** (0/4 solved):
  - [Jump Game](./Week-11/Day-073_Dynamic-Programming-and-Greedy/Jump-Game/understanding.md) `M`
  - [Jump Game II](./Week-11/Day-073_Dynamic-Programming-and-Greedy/Jump-Game-II/understanding.md) `M`
  - [Jump Game III](./Week-11/Day-073_Dynamic-Programming-and-Greedy/Jump-Game-III/understanding.md) `M`
  - [Partition Equal Subset Sum](./Week-11/Day-073_Dynamic-Programming-and-Greedy/Partition-Equal-Subset-Sum/understanding.md) `M`
- **Day 74 — System Design & OOD** (0/2 solved):
  - [Design A News Feed System](./Week-11/Day-074_System-Design-and-OOD/Design-A-News-Feed-System/understanding.md) `System Design`
  - [Design a Restaurant Management system](./Week-11/Day-074_System-Design-and-OOD/Design-a-Restaurant-Management-system/understanding.md) `OOD Design`
- **Day 75 (Revision):** [Revise questions solved from Day 61 to 74](./Week-11/Day-075_Revision/README.md)
- **Day 76 — Dynamic Programming (2D Grid & LIS)** (0/4 solved):
  - [Longest Increasing Subsequence](./Week-11/Day-076_Dynamic-Programming-2D-Grid-and-LIS/Longest-Increasing-Subsequence/understanding.md) `M`
  - [Unique Paths](./Week-11/Day-076_Dynamic-Programming-2D-Grid-and-LIS/Unique-Paths/understanding.md) `M`
  - [Unique Paths II](./Week-11/Day-076_Dynamic-Programming-2D-Grid-and-LIS/Unique-Paths-II/understanding.md) `M`
  - [Maximal Square](./Week-11/Day-076_Dynamic-Programming-2D-Grid-and-LIS/Maximal-Square/understanding.md) `M`
- **Day 77 — Dynamic Programming (House Robber & Decoding)** (0/4 solved):
  - [House Robber](./Week-11/Day-077_Dynamic-Programming-House-Robber-and-Decoding/House-Robber/understanding.md) `M`
  - [House Robber II](./Week-11/Day-077_Dynamic-Programming-House-Robber-and-Decoding/House-Robber-II/understanding.md) `M`
  - [House Robber III](./Week-11/Day-077_Dynamic-Programming-House-Robber-and-Decoding/House-Robber-III/understanding.md) `M`
  - [Decode Ways](./Week-11/Day-077_Dynamic-Programming-House-Robber-and-Decoding/Decode-Ways/understanding.md) `M`

</details>

<details>
<summary><strong>Week 12 (Days 78–84)</strong> — Phase 4: 2D DP, Heaps, Backtracking & Advanced Arrays (0/25 solved · 7 days)</summary>

- **Day 78 — Dynamic Programming (Stock & String)** (0/4 solved):
  - [Best Time to Buy and Sell Stock II](./Week-12/Day-078_Dynamic-Programming-Stock-and-String/Best-Time-to-Buy-and-Sell-Stock-II/understanding.md) `M`
  - [Minimum Path Sum](./Week-12/Day-078_Dynamic-Programming-Stock-and-String/Minimum-Path-Sum/understanding.md) `M`
  - [Longest Common Subsequence](./Week-12/Day-078_Dynamic-Programming-Stock-and-String/Longest-Common-Subsequence/understanding.md) `M`
  - [Palindrome Partitioning](./Week-12/Day-078_Dynamic-Programming-Stock-and-String/Palindrome-Partitioning/understanding.md) `M`
- **Day 79 — Dynamic Programming (Trees & Target Sum)** (0/4 solved):
  - [Unique Binary Search Trees](./Week-12/Day-079_Dynamic-Programming-Trees-and-Target-Sum/Unique-Binary-Search-Trees/understanding.md) `M`
  - [Unique Binary Search Trees II](./Week-12/Day-079_Dynamic-Programming-Trees-and-Target-Sum/Unique-Binary-Search-Trees-II/understanding.md) `M`
  - [Target Sum](./Week-12/Day-079_Dynamic-Programming-Trees-and-Target-Sum/Target-Sum/understanding.md) `M`
  - [Triangle](./Week-12/Day-079_Dynamic-Programming-Trees-and-Target-Sum/Triangle/understanding.md) `M`
- **Day 80 — Dynamic Programming (Palindromes & Subsets)** (0/4 solved):
  - [Longest Palindromic Subsequence](./Week-12/Day-080_Dynamic-Programming-Palindromes-and-Subsets/Longest-Palindromic-Subsequence/understanding.md) `M`
  - [Partition to K Equal Sum Subsets](./Week-12/Day-080_Dynamic-Programming-Palindromes-and-Subsets/Partition-to-K-Equal-Sum-Subsets/understanding.md) `M`
  - [Delete and Earn](./Week-12/Day-080_Dynamic-Programming-Palindromes-and-Subsets/Delete-and-Earn/understanding.md) `M`
  - [Palindromic Substrings](./Week-12/Day-080_Dynamic-Programming-Palindromes-and-Subsets/Palindromic-Substrings/understanding.md) `M`
- **Day 81 — Dynamic Programming (Strings & Costs)** (0/4 solved):
  - [Longest String Chain](./Week-12/Day-081_Dynamic-Programming-Strings-and-Costs/Longest-String-Chain/understanding.md) `M`
  - [Minimum Cost For Tickets](./Week-12/Day-081_Dynamic-Programming-Strings-and-Costs/Minimum-Cost-For-Tickets/understanding.md) `M`
  - [Delete Operation for Two Strings](./Week-12/Day-081_Dynamic-Programming-Strings-and-Costs/Delete-Operation-for-Two-Strings/understanding.md) `M`
  - [Perfect Squares](./Week-12/Day-081_Dynamic-Programming-Strings-and-Costs/Perfect-Squares/understanding.md) `M`
- **Day 82 — System Design & OOD** (0/2 solved):
  - [Design A Chat System](./Week-12/Day-082_System-Design-and-OOD/Design-A-Chat-System/understanding.md) `System Design`
  - [Design Chess](./Week-12/Day-082_System-Design-and-OOD/Design-Chess/understanding.md) `OOD Design`
- **Day 83 — Dynamic Programming (Partition & Math)** (0/4 solved):
  - [Different Ways to Add Parentheses](./Week-12/Day-083_Dynamic-Programming-Partition-and-Math/Different-Ways-to-Add-Parentheses/understanding.md) `M`
  - [Longest Palindromic Substring](./Week-12/Day-083_Dynamic-Programming-Partition-and-Math/Longest-Palindromic-Substring/understanding.md) `M`
  - [Largest Divisible Subset](./Week-12/Day-083_Dynamic-Programming-Partition-and-Math/Largest-Divisible-Subset/understanding.md) `M`
  - [Integer Break](./Week-12/Day-083_Dynamic-Programming-Partition-and-Math/Integer-Break/understanding.md) `M`
- **Day 84 — DP & Backtracking Simulation** (0/3 solved):
  - [Matchsticks to Square](./Week-12/Day-084_DP-and-Backtracking-Simulation/Matchsticks-to-Square/understanding.md) `M`
  - [Knight Dialer](./Week-12/Day-084_DP-and-Backtracking-Simulation/Knight-Dialer/understanding.md) `M`
  - [Minesweeper](./Week-12/Day-084_DP-and-Backtracking-Simulation/Minesweeper/understanding.md) `M`

</details>

<details>
<summary><strong>Week 13 (Days 85–91)</strong> — Phase 4: 2D DP, Heaps, Backtracking & Advanced Arrays (0/22 solved · 7 days)</summary>

- **Day 85 — Math & Strings** (0/4 solved):
  - [Random Pick with Weight](./Week-13/Day-085_Math-and-Strings/Random-Pick-with-Weight/understanding.md) `M`
  - [Pow(x, n)](./Week-13/Day-085_Math-and-Strings/Powx-n/understanding.md) `M`
  - [Reverse Integer](./Week-13/Day-085_Math-and-Strings/Reverse-Integer/understanding.md) `M`
  - [Multiply Strings](./Week-13/Day-085_Math-and-Strings/Multiply-Strings/understanding.md) `M`
- **Day 86 — Math & Geometry** (0/4 solved):
  - [Count Primes](./Week-13/Day-086_Math-and-Geometry/Count-Primes/understanding.md) `M`
  - [Integer to Roman](./Week-13/Day-086_Math-and-Geometry/Integer-to-Roman/understanding.md) `M`
  - [Robot Bounded In Circle](./Week-13/Day-086_Math-and-Geometry/Robot-Bounded-In-Circle/understanding.md) `M`
  - [Angle Between Hands of a Clock](./Week-13/Day-086_Math-and-Geometry/Angle-Between-Hands-of-a-Clock/understanding.md) `M`
- **Day 87 — Heaps / Priority Queues** (0/4 solved):
  - [K Closest Points to Origin](./Week-13/Day-087_Heaps-Priority-Queues/K-Closest-Points-to-Origin/understanding.md) `M`
  - [Task Scheduler](./Week-13/Day-087_Heaps-Priority-Queues/Task-Scheduler/understanding.md) `M`
  - [Top K Frequent Elements](./Week-13/Day-087_Heaps-Priority-Queues/Top-K-Frequent-Elements/understanding.md) `M`
  - [Find K Closest Elements](./Week-13/Day-087_Heaps-Priority-Queues/Find-K-Closest-Elements/understanding.md) `M`
- **Day 88 — Heaps & Strings** (0/4 solved):
  - [Kth Largest Element in an Array](./Week-13/Day-088_Heaps-and-Strings/Kth-Largest-Element-in-an-Array/understanding.md) `M`
  - [Kth Smallest Element in a Sorted Matrix](./Week-13/Day-088_Heaps-and-Strings/Kth-Smallest-Element-in-a-Sorted-Matrix/understanding.md) `M`
  - [Top K Frequent Words](./Week-13/Day-088_Heaps-and-Strings/Top-K-Frequent-Words/understanding.md) `M`
  - [Reorganize String](./Week-13/Day-088_Heaps-and-Strings/Reorganize-String/understanding.md) `M`
- **Day 89 — System Design & OOD** (0/2 solved):
  - [Design A Search Autocomplete System](./Week-13/Day-089_System-Design-and-OOD/Design-A-Search-Autocomplete-System/understanding.md) `System Design`
  - [Design an Online Stock Brokerage System](./Week-13/Day-089_System-Design-and-OOD/Design-an-Online-Stock-Brokerage-System/understanding.md) `OOD Design`
- **Day 90 (Revision):** [Revise questions solved from Day 76 to 89](./Week-13/Day-090_Revision/README.md)
- **Day 91 — Heaps & Greedy** (0/4 solved):
  - [Sort Characters By Frequency](./Week-13/Day-091_Heaps-and-Greedy/Sort-Characters-By-Frequency/understanding.md) `M`
  - [Car Pooling](./Week-13/Day-091_Heaps-and-Greedy/Car-Pooling/understanding.md) `M`
  - [Find K Pairs with Smallest Sums](./Week-13/Day-091_Heaps-and-Greedy/Find-K-Pairs-with-Smallest-Sums/understanding.md) `M`
  - [Maximum Number of Events That Can Be Attended](./Week-13/Day-091_Heaps-and-Greedy/Maximum-Number-of-Events-That-Can-Be-Attended/understanding.md) `M`

</details>

<details>
<summary><strong>Week 14 (Days 92–98)</strong> — Phase 4: 2D DP, Heaps, Backtracking & Advanced Arrays (0/27 solved · 7 days)</summary>

- **Day 92 — Trie Data Structure** (0/5 solved):
  - [Implement Trie (Prefix Tree)](./Week-14/Day-092_Trie-Data-Structure/Implement-Trie-Prefix-Tree/understanding.md) `M`
  - [Word Break](./Week-14/Day-092_Trie-Data-Structure/Word-Break/understanding.md) `M`
  - [Design Add and Search Words Data Structure](./Week-14/Day-092_Trie-Data-Structure/Design-Add-and-Search-Words-Data-Structure/understanding.md) `M`
  - [Search Suggestions System](./Week-14/Day-092_Trie-Data-Structure/Search-Suggestions-System/understanding.md) `M`
  - [Remove Sub-Folders from the Filesystem](./Week-14/Day-092_Trie-Data-Structure/Remove-Sub-Folders-from-the-Filesystem/understanding.md) `M`
- **Day 93 — Backtracking (Subsets & Permutations)** (0/4 solved):
  - [Permutations](./Week-14/Day-093_Backtracking-Subsets-and-Permutations/Permutations/understanding.md) `M`
  - [Permutations II](./Week-14/Day-093_Backtracking-Subsets-and-Permutations/Permutations-II/understanding.md) `M`
  - [Subsets](./Week-14/Day-093_Backtracking-Subsets-and-Permutations/Subsets/understanding.md) `M`
  - [Subsets II](./Week-14/Day-093_Backtracking-Subsets-and-Permutations/Subsets-II/understanding.md) `M`
- **Day 94 — Backtracking (Combinations)** (0/4 solved):
  - [Next Permutation](./Week-14/Day-094_Backtracking-Combinations/Next-Permutation/understanding.md) `M`
  - [Combinations](./Week-14/Day-094_Backtracking-Combinations/Combinations/understanding.md) `M`
  - [Letter Combinations of a Phone Number](./Week-14/Day-094_Backtracking-Combinations/Letter-Combinations-of-a-Phone-Number/understanding.md) `M`
  - [Generate Parentheses](./Week-14/Day-094_Backtracking-Combinations/Generate-Parentheses/understanding.md) `M`
- **Day 95 — Backtracking (Combination Sum)** (0/4 solved):
  - [Combination Sum](./Week-14/Day-095_Backtracking-Combination-Sum/Combination-Sum/understanding.md) `M`
  - [Combination Sum III](./Week-14/Day-095_Backtracking-Combination-Sum/Combination-Sum-III/understanding.md) `M`
  - [Combination Sum IV](./Week-14/Day-095_Backtracking-Combination-Sum/Combination-Sum-IV/understanding.md) `M`
  - [Restore IP Addresses](./Week-14/Day-095_Backtracking-Combination-Sum/Restore-IP-Addresses/understanding.md) `M`
- **Day 96 — Greedy Algorithms** (0/4 solved):
  - [Gas Station](./Week-14/Day-096_Greedy-Algorithms/Gas-Station/understanding.md) `M`
  - [Partition Labels](./Week-14/Day-096_Greedy-Algorithms/Partition-Labels/understanding.md) `M`
  - [Valid Parenthesis String](./Week-14/Day-096_Greedy-Algorithms/Valid-Parenthesis-String/understanding.md) `M`
  - [Minimum Number of Arrows to Burst Balloons](./Week-14/Day-096_Greedy-Algorithms/Minimum-Number-of-Arrows-to-Burst-Balloons/understanding.md) `M`
- **Day 97 — System Design & OOD** (0/2 solved):
  - [Design YouTube](./Week-14/Day-097_System-Design-and-OOD/Design-YouTube/understanding.md) `System Design`
  - [Design a Car Rental System](./Week-14/Day-097_System-Design-and-OOD/Design-a-Car-Rental-System/understanding.md) `OOD Design`
- **Day 98 — Bit Manipulation** (0/4 solved):
  - [Single Number II](./Week-14/Day-098_Bit-Manipulation/Single-Number-II/understanding.md) `M`
  - [Single Number III](./Week-14/Day-098_Bit-Manipulation/Single-Number-III/understanding.md) `M`
  - [Maximum XOR of Two Numbers in an Array](./Week-14/Day-098_Bit-Manipulation/Maximum-XOR-of-Two-Numbers-in-an-Array/understanding.md) `M`
  - [Divide Two Integers](./Week-14/Day-098_Bit-Manipulation/Divide-Two-Integers/understanding.md) `M`

</details>

<details>
<summary><strong>Week 15 (Days 99–105)</strong> — Phase 4: 2D DP, Heaps, Backtracking & Advanced Arrays (0/18 solved · 7 days)</summary>

- **Day 99 — Bit Manipulation** (0/3 solved):
  - [Sum of Two Integers](./Week-15/Day-099_Bit-Manipulation/Sum-of-Two-Integers/understanding.md) `M`
  - [Bitwise AND of Numbers Range](./Week-15/Day-099_Bit-Manipulation/Bitwise-AND-of-Numbers-Range/understanding.md) `M`
  - [Gray Code](./Week-15/Day-099_Bit-Manipulation/Gray-Code/understanding.md) `M`
- **Day 100 — Advanced DSA (Sliding Window & Monotonic Stack)** (0/3 solved):
  - [Sliding Window Maximum](./Week-15/Day-100_Advanced-DSA-Sliding-Window-and-Monotonic-Stack/Sliding-Window-Maximum/understanding.md) `H`
  - [Trapping Rain Water](./Week-15/Day-100_Advanced-DSA-Sliding-Window-and-Monotonic-Stack/Trapping-Rain-Water/understanding.md) `H`
  - [Count of Smaller Numbers After Self](./Week-15/Day-100_Advanced-DSA-Sliding-Window-and-Monotonic-Stack/Count-of-Smaller-Numbers-After-Self/understanding.md) `H`
- **Day 101 — Hard Arrays & Submatrices** (0/4 solved):
  - [Candy](./Week-15/Day-101_Hard-Arrays-and-Submatrices/Candy/understanding.md) `H`
  - [Reverse Pairs](./Week-15/Day-101_Hard-Arrays-and-Submatrices/Reverse-Pairs/understanding.md) `H`
  - [Subarrays with K Different Integers](./Week-15/Day-101_Hard-Arrays-and-Submatrices/Subarrays-with-K-Different-Integers/understanding.md) `H`
  - [Number of Submatrices That Sum to Target](./Week-15/Day-101_Hard-Arrays-and-Submatrices/Number-of-Submatrices-That-Sum-to-Target/understanding.md) `H`
- **Day 102 — Hard Arrays & Monotonic Deque** (0/3 solved):
  - [Shortest Subarray with Sum at Least K](./Week-15/Day-102_Hard-Arrays-and-Monotonic-Deque/Shortest-Subarray-with-Sum-at-Least-K/understanding.md) `H`
  - [Maximum Gap](./Week-15/Day-102_Hard-Arrays-and-Monotonic-Deque/Maximum-Gap/understanding.md) `H`
  - [First Missing Positive](./Week-15/Day-102_Hard-Arrays-and-Monotonic-Deque/First-Missing-Positive/understanding.md) `H`
- **Day 103 — Hard Linked Lists & Cache** (0/3 solved):
  - [Shuffle an Array](./Week-15/Day-103_Hard-Linked-Lists-and-Cache/Shuffle-an-Array/understanding.md) `M`
  - [Reverse Nodes in k-Group](./Week-15/Day-103_Hard-Linked-Lists-and-Cache/Reverse-Nodes-in-k-Group/understanding.md) `H`
  - [LFU Cache](./Week-15/Day-103_Hard-Linked-Lists-and-Cache/LFU-Cache/understanding.md) `H`
- **Day 104 — System Design & OOD** (0/2 solved):
  - [Design Google Drive](./Week-15/Day-104_System-Design-and-OOD/Design-Google-Drive/understanding.md) `System Design`
  - [Design LinkedIn](./Week-15/Day-104_System-Design-and-OOD/Design-LinkedIn/understanding.md) `OOD Design`
- **Day 105 (Revision):** [Revise questions solved from Day 91 to 104](./Week-15/Day-105_Revision/README.md)

</details>

<details>
<summary><strong>Week 16 (Days 106–112)</strong> — Phase 5: Hard Interview Mastery, System Design & Behavioral (0/20 solved · 7 days)</summary>

- **Day 106 — Hard Stack Problems** (0/3 solved):
  - [Basic Calculator](./Week-16/Day-106_Hard-Stack-Problems/Basic-Calculator/understanding.md) `H`
  - [Largest Rectangle in Histogram](./Week-16/Day-106_Hard-Stack-Problems/Largest-Rectangle-in-Histogram/understanding.md) `H`
  - [Longest Valid Parentheses](./Week-16/Day-106_Hard-Stack-Problems/Longest-Valid-Parentheses/understanding.md) `H`
- **Day 107 — Hard Data Structures** (0/3 solved):
  - [Maximum Frequency Stack](./Week-16/Day-107_Hard-Data-Structures/Maximum-Frequency-Stack/understanding.md) `H`
  - [The Skyline Problem](./Week-16/Day-107_Hard-Data-Structures/The-Skyline-Problem/understanding.md) `H`
  - [Minimum Window Substring](./Week-16/Day-107_Hard-Data-Structures/Minimum-Window-Substring/understanding.md) `H`
- **Day 108 — Hard Strings** (0/3 solved):
  - [Palindrome Pairs](./Week-16/Day-108_Hard-Strings/Palindrome-Pairs/understanding.md) `H`
  - [Shortest Palindrome](./Week-16/Day-108_Hard-Strings/Shortest-Palindrome/understanding.md) `H`
  - [Text Justification](./Week-16/Day-108_Hard-Strings/Text-Justification/understanding.md) `H`
- **Day 109 — Math & Strings** (0/3 solved):
  - [Nth Digit](./Week-16/Day-109_Math-and-Strings/Nth-Digit/understanding.md) `M`
  - [Integer to English Words](./Week-16/Day-109_Math-and-Strings/Integer-to-English-Words/understanding.md) `H`
  - [Max Points on a Line](./Week-16/Day-109_Math-and-Strings/Max-Points-on-a-Line/understanding.md) `H`
- **Day 110 — Hard Binary Search & DP** (0/3 solved):
  - [Maximum Profit in Job Scheduling](./Week-16/Day-110_Hard-Binary-Search-and-DP/Maximum-Profit-in-Job-Scheduling/understanding.md) `H`
  - [Median of Two Sorted Arrays](./Week-16/Day-110_Hard-Binary-Search-and-DP/Median-of-Two-Sorted-Arrays/understanding.md) `H`
  - [Find Minimum in Rotated Sorted Array II](./Week-16/Day-110_Hard-Binary-Search-and-DP/Find-Minimum-in-Rotated-Sorted-Array-II/understanding.md) `H`
- **Day 111 — Hard Graphs & BFS** (0/3 solved):
  - [Word Ladder](./Week-16/Day-111_Hard-Graphs-and-BFS/Word-Ladder/understanding.md) `H`
  - [Word Ladder II](./Week-16/Day-111_Hard-Graphs-and-BFS/Word-Ladder-II/understanding.md) `H`
  - [Longest Increasing Path in a Matrix](./Week-16/Day-111_Hard-Graphs-and-BFS/Longest-Increasing-Path-in-a-Matrix/understanding.md) `H`
- **Day 112 — System Design & OOD** (0/2 solved):
  - [Design Twitter](./Week-16/Day-112_System-Design-and-OOD/Design-Twitter/understanding.md) `System Design`
  - [Design Facebook - a social network](./Week-16/Day-112_System-Design-and-OOD/Design-Facebook-a-social-network/understanding.md) `System Design & OOD`

</details>

<details>
<summary><strong>Week 17 (Days 113–119)</strong> — Phase 5: Hard Interview Mastery, System Design & Behavioral (0/21 solved · 7 days)</summary>

- **Day 113 — Hard Graphs & Trie** (0/3 solved):
  - [Word Search II](./Week-17/Day-113_Hard-Graphs-and-Trie/Word-Search-II/understanding.md) `H`
  - [Bus Routes](./Week-17/Day-113_Hard-Graphs-and-Trie/Bus-Routes/understanding.md) `H`
  - [Critical Connections in a Network](./Week-17/Day-113_Hard-Graphs-and-Trie/Critical-Connections-in-a-Network/understanding.md) `H`
- **Day 114 — Hard BFS & Eulerian Path** (0/3 solved):
  - [Shortest Path in a Grid with Obstacles Elimination](./Week-17/Day-114_Hard-BFS-and-Eulerian-Path/Shortest-Path-in-a-Grid-with-Obstacles-Elimination/understanding.md) `H`
  - [Reconstruct Itinerary](./Week-17/Day-114_Hard-BFS-and-Eulerian-Path/Reconstruct-Itinerary/understanding.md) `H`
  - [Making A Large Island](./Week-17/Day-114_Hard-BFS-and-Eulerian-Path/Making-A-Large-Island/understanding.md) `H`
- **Day 115 — Hard Heaps & Two Heaps** (0/3 solved):
  - [Merge k Sorted Lists](./Week-17/Day-115_Hard-Heaps-and-Two-Heaps/Merge-k-Sorted-Lists/understanding.md) `H`
  - [Find Median from Data Stream](./Week-17/Day-115_Hard-Heaps-and-Two-Heaps/Find-Median-from-Data-Stream/understanding.md) `H`
  - [Smallest Range Covering Elements from K Lists](./Week-17/Day-115_Hard-Heaps-and-Two-Heaps/Smallest-Range-Covering-Elements-from-K-Lists/understanding.md) `H`
- **Day 116 — Hard Heaps & Binary Search** (0/3 solved):
  - [Minimum Number of Refueling Stops](./Week-17/Day-116_Hard-Heaps-and-Binary-Search/Minimum-Number-of-Refueling-Stops/understanding.md) `H`
  - [Swim in Rising Water](./Week-17/Day-116_Hard-Heaps-and-Binary-Search/Swim-in-Rising-Water/understanding.md) `H`
  - [Longest Duplicate Substring](./Week-17/Day-116_Hard-Heaps-and-Binary-Search/Longest-Duplicate-Substring/understanding.md) `H`
- **Day 117 — Hard Backtracking & DP** (0/4 solved):
  - [N-Queens](./Week-17/Day-117_Hard-Backtracking-and-DP/N-Queens/understanding.md) `H`
  - [Permutation Sequence](./Week-17/Day-117_Hard-Backtracking-and-DP/Permutation-Sequence/understanding.md) `H`
  - [Sudoku Solver](./Week-17/Day-117_Hard-Backtracking-and-DP/Sudoku-Solver/understanding.md) `H`
  - [Palindrome Partitioning II](./Week-17/Day-117_Hard-Backtracking-and-DP/Palindrome-Partitioning-II/understanding.md) `H`
- **Day 118 — Recursion & Backtracking** (0/3 solved):
  - [K-th Symbol in Grammar](./Week-17/Day-118_Recursion-and-Backtracking/K-th-Symbol-in-Grammar/understanding.md) `M`
  - [Remove Invalid Parentheses](./Week-17/Day-118_Recursion-and-Backtracking/Remove-Invalid-Parentheses/understanding.md) `H`
  - [Unique Paths III](./Week-17/Day-118_Recursion-and-Backtracking/Unique-Paths-III/understanding.md) `H`
- **Day 119 — System Design & OOD** (0/2 solved):
  - [Proximity Service](./Week-17/Day-119_System-Design-and-OOD/Proximity-Service/understanding.md) `System Design`
  - [Design Cricinfo](./Week-17/Day-119_System-Design-and-OOD/Design-Cricinfo/understanding.md) `OOD Design`

</details>

<details>
<summary><strong>Week 18 (Days 120–126)</strong> — Phase 5: Hard Interview Mastery, System Design & Behavioral (0/20 solved · 7 days)</summary>

- **Day 120 (Revision):** [Revise questions solved from Day 106 to 119](./Week-18/Day-120_Revision/README.md)
- **Day 121 — Behavioral & Leadership** (0/5 solved):
  - [What are your strengths and weaknesses?](./Week-18/Day-121_Behavioral-and-Leadership/What-are-your-strengths-and-weaknesses/understanding.md) `Behavioral`
  - [Tell me about your most challenging customer. How did you resolve their issues and make them satisfied?](./Week-18/Day-121_Behavioral-and-Leadership/Tell-me-about-your-most-challenging-customer-How-did-you-resolve-their/understanding.md) `Behavioral`
  - [Describe a time when you had to make a decision without having all the data or information you needed.](./Week-18/Day-121_Behavioral-and-Leadership/Describe-a-time-when-you-had-to-make-a-decision-without-having-all-the/understanding.md) `Behavioral`
  - [Which {company's} leadership principle resonates with you most?](./Week-18/Day-121_Behavioral-and-Leadership/Which-companys-leadership-principle-resonates-with-you-most/understanding.md) `Behavioral`
  - [Tell me about a time when you were working on a project, and you realized that you needed to make changes to what you were doing. How did you feel about the work you had already completed?](./Week-18/Day-121_Behavioral-and-Leadership/Tell-me-about-a-time-when-you-were-working-on-a-project-and-you/understanding.md) `Behavioral`
- **Day 122 — System Design** (0/2 solved):
  - [Nearby Friends](./Week-18/Day-122_System-Design/Nearby-Friends/understanding.md) `System Design`
  - [Google Maps](./Week-18/Day-122_System-Design/Google-Maps/understanding.md) `System Design`
- **Day 123 — Hard Dynamic Programming** (0/3 solved):
  - [Edit Distance](./Week-18/Day-123_Hard-Dynamic-Programming/Edit-Distance/understanding.md) `M`
  - [Regular Expression Matching](./Week-18/Day-123_Hard-Dynamic-Programming/Regular-Expression-Matching/understanding.md) `H`
  - [Maximal Rectangle](./Week-18/Day-123_Hard-Dynamic-Programming/Maximal-Rectangle/understanding.md) `H`
- **Day 124 — Behavioral & Leadership** (0/5 solved):
  - [Can you give me an example of a time when you exceeded expectations?](./Week-18/Day-124_Behavioral-and-Leadership/Can-you-give-me-an-example-of-a-time-when-you-exceeded-expectations/understanding.md) `Behavioral`
  - [Can you describe a time when you took the lead on a project?](./Week-18/Day-124_Behavioral-and-Leadership/Can-you-describe-a-time-when-you-took-the-lead-on-a-project/understanding.md) `Behavioral`
  - [Think about a time you received negative feedback. How did you deal with that?](./Week-18/Day-124_Behavioral-and-Leadership/Think-about-a-time-you-received-negative-feedback-How-did-you-deal-with/understanding.md) `Behavioral`
  - [Tell me about a time when you had to deal with ambiguity. How did you overcome the ambiguity to reach a positive outcome?](./Week-18/Day-124_Behavioral-and-Leadership/Tell-me-about-a-time-when-you-had-to-deal-with-ambiguity-How-did-you/understanding.md) `Behavioral`
  - [Have you been stressed over a certain project delivery in the past? Did it affect your work-life balance? How did you deal with it?](./Week-18/Day-124_Behavioral-and-Leadership/Have-you-been-stressed-over-a-certain-project-delivery-in-the-past-Did/understanding.md) `Behavioral`
- **Day 125 — System Design** (0/2 solved):
  - [Distributed Message Queue](./Week-18/Day-125_System-Design/Distributed-Message-Queue/understanding.md) `System Design`
  - [Distributed Email Service](./Week-18/Day-125_System-Design/Distributed-Email-Service/understanding.md) `System Design`
- **Day 126 — Hard DP & Binary Search** (0/3 solved):
  - [Split Array Largest Sum](./Week-18/Day-126_Hard-DP-and-Binary-Search/Split-Array-Largest-Sum/understanding.md) `H`
  - [Burst Balloons](./Week-18/Day-126_Hard-DP-and-Binary-Search/Burst-Balloons/understanding.md) `H`
  - [Wildcard Matching](./Week-18/Day-126_Hard-DP-and-Binary-Search/Wildcard-Matching/understanding.md) `H`

</details>

<details>
<summary><strong>Week 19 (Days 127–133)</strong> — Phase 5: Hard Interview Mastery, System Design & Behavioral (0/28 solved · 7 days)</summary>

- **Day 127 — Behavioral & Leadership** (0/5 solved):
  - [Tell me about a time you have disagreed with your manager and how you handled it.](./Week-19/Day-127_Behavioral-and-Leadership/Tell-me-about-a-time-you-have-disagreed-with-your-manager-and-how-you/understanding.md) `Behavioral`
  - [How do you motivate others? Can you give me an example of a time you have motivated someone?](./Week-19/Day-127_Behavioral-and-Leadership/How-do-you-motivate-others-Can-you-give-me-an-example-of-a-time-you/understanding.md) `Behavioral`
  - [Tell me about a time when you took a risk and failed. What did you learn from that experience?](./Week-19/Day-127_Behavioral-and-Leadership/Tell-me-about-a-time-when-you-took-a-risk-and-failed-What-did-you-learn/understanding.md) `Behavioral`
  - [What obstacles have you encountered in your career? How did you overcome them?](./Week-19/Day-127_Behavioral-and-Leadership/What-obstacles-have-you-encountered-in-your-career-How-did-you-overcome/understanding.md) `Behavioral`
  - [Tell me about a project you are proud of. How did you ensure high standards were met in delivering that project?](./Week-19/Day-127_Behavioral-and-Leadership/Tell-me-about-a-project-you-are-proud-of-How-did-you-ensure-high/understanding.md) `Behavioral`
- **Day 128 — System Design** (0/2 solved):
  - [S3-like Object Storage](./Week-19/Day-128_System-Design/S3-like-Object-Storage/understanding.md) `System Design`
  - [Real-time Gaming Leaderboard](./Week-19/Day-128_System-Design/Real-time-Gaming-Leaderboard/understanding.md) `System Design`
- **Day 129 — DP & Monotonic Stack** (0/4 solved):
  - [Best Time to Buy and Sell Stock IV](./Week-19/Day-129_DP-and-Monotonic-Stack/Best-Time-to-Buy-and-Sell-Stock-IV/understanding.md) `H`
  - [Word Break II](./Week-19/Day-129_DP-and-Monotonic-Stack/Word-Break-II/understanding.md) `H`
  - [Russian Doll Envelopes](./Week-19/Day-129_DP-and-Monotonic-Stack/Russian-Doll-Envelopes/understanding.md) `H`
  - [Validate Stack Sequences](./Week-19/Day-129_DP-and-Monotonic-Stack/Validate-Stack-Sequences/understanding.md) `M`
- **Day 130 — Behavioral & Leadership** (0/5 solved):
  - [Why do you want to work for {company}?](./Week-19/Day-130_Behavioral-and-Leadership/Why-do-you-want-to-work-for-company/understanding.md) `Behavioral`
  - [Tell me about a time when you have had to work to earn someone’s trust.](./Week-19/Day-130_Behavioral-and-Leadership/Tell-me-about-a-time-when-you-have-had-to-work-to-earn-someone’s-trust/understanding.md) `Behavioral`
  - [Describe a time when you were given a project to work on, but your responsibilities were unclear. What did you do?](./Week-19/Day-130_Behavioral-and-Leadership/Describe-a-time-when-you-were-given-a-project-to-work-on-but-your/understanding.md) `Behavioral`
  - [Tell me about a time you showed initiative.](./Week-19/Day-130_Behavioral-and-Leadership/Tell-me-about-a-time-you-showed-initiative/understanding.md) `Behavioral`
  - [You see a co-worker struggling with a task. What do you do?](./Week-19/Day-130_Behavioral-and-Leadership/You-see-a-co-worker-struggling-with-a-task-What-do-you-do/understanding.md) `Behavioral`
- **Day 131 — System Design** (0/2 solved):
  - [Payment System](./Week-19/Day-131_System-Design/Payment-System/understanding.md) `System Design`
  - [Digital Wallet](./Week-19/Day-131_System-Design/Digital-Wallet/understanding.md) `System Design`
- **Day 132 — Hard DP & Greedy** (0/4 solved):
  - [Minimum Insertion Steps to Make a String Palindrome](./Week-19/Day-132_Hard-DP-and-Greedy/Minimum-Insertion-Steps-to-Make-a-String-Palindrome/understanding.md) `H`
  - [Minimum Cost to Cut a Stick](./Week-19/Day-132_Hard-DP-and-Greedy/Minimum-Cost-to-Cut-a-Stick/understanding.md) `H`
  - [Minimum Number of Taps to Open to Water a Garden](./Week-19/Day-132_Hard-DP-and-Greedy/Minimum-Number-of-Taps-to-Open-to-Water-a-Garden/understanding.md) `H`
  - [Binary Tree Cameras](./Week-19/Day-132_Hard-DP-and-Greedy/Binary-Tree-Cameras/understanding.md) `H`
- **Day 133 — Behavioral & Leadership** (0/6 solved):
  - [Describe for me a time when you had to choose short-term sacrifices to achieve long-term gains.](./Week-19/Day-133_Behavioral-and-Leadership/Describe-for-me-a-time-when-you-had-to-choose-short-term-sacrifices-to/understanding.md) `Behavioral`
  - [How do you deal with having to provide feedback to someone?](./Week-19/Day-133_Behavioral-and-Leadership/How-do-you-deal-with-having-to-provide-feedback-to-someone/understanding.md) `Behavioral`
  - [Tell me about a time you failed to meet a deadline. How did you cope with that?](./Week-19/Day-133_Behavioral-and-Leadership/Tell-me-about-a-time-you-failed-to-meet-a-deadline-How-did-you-cope/understanding.md) `Behavioral`
  - [Has there been a time when your contribution was overlooked and somebody else from your team took credit for it? How did you deal with it?](./Week-19/Day-133_Behavioral-and-Leadership/Has-there-been-a-time-when-your-contribution-was-overlooked-and/understanding.md) `Behavioral`
  - [Tell me about a project you are proud of. How did you ensure high standards were met in delivering that project?](./Week-19/Day-133_Behavioral-and-Leadership/Tell-me-about-a-project-you-are-proud-of-How-did-you-ensure-high/understanding.md) `Behavioral`
  - [Have you been in a conflict with a fellow coworker? How did you deal with it and what was the end result?](./Week-19/Day-133_Behavioral-and-Leadership/Have-you-been-in-a-conflict-with-a-fellow-coworker-How-did-you-deal/understanding.md) `Behavioral`

</details>

<details>
<summary><strong>Week 20 (Days 134–135)</strong> — Phase 5: Hard Interview Mastery, System Design & Behavioral (0/2 solved · 2 days)</summary>

- **Day 134 — System Design & OOD** (0/2 solved):
  - [Design Uber backend](./Week-20/Day-134_System-Design-and-OOD/Design-Uber-backend/understanding.md) `System Design`
  - [Design Ticketmaster](./Week-20/Day-134_System-Design-and-OOD/Design-Ticketmaster/understanding.md) `System Design & OOD`
- **Day 135 (Revision):** [Revise questions solved from Day 121 to 134](./Week-20/Day-135_Revision/README.md)

</details>

<details>
<summary><strong>Weeks 21–22: Final Mock & Complete Revision</strong> — Phase 5: Interview Mastery & Revision (0/0 solved · 1 days)</summary>

- **Day 136 - 150 (Final Revision & Mock Interviews):** [Revise all questions solved from Day 1 to 134 & complete mock interviews](./Week-21/Day-136-150_Final-Revision-and-Mock-Interviews/README.md)

</details>
