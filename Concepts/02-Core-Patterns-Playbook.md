# Core DSA Patterns Playbook

Document your reusable problem-solving templates and recognition triggers here.

## 1. Two Pointers
- **When to use:** Sorted arrays, palindrome checks, pair sums, removing duplicates in-place.
- **Key idea:** Shrink search space from both ends or maintain slow/fast pointers.

## 2. Sliding Window
- **When to use:** Contiguous subarray / substring problems with constraints (length, sum, distinct chars).
- **Template:** Expand `right`, update window state, shrink `left` while invalid/valid.

## 3. Binary Search on Answer
- **When to use:** "Find minimum/maximum X such that condition(X) is feasible" with monotonic property.

## 4. Monotonic Stack / Queue
- **When to use:** Next greater/smaller element, histogram area, sliding window maximum.

## 5. Graphs & Trees (BFS / DFS)
- **BFS:** Shortest path in unweighted graph, level-order traversal.
- **DFS:** Connected components, topological sort, cycle detection, tree recursion.
