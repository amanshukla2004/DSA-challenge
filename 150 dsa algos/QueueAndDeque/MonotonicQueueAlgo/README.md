# Monotonic Queue

> **Category:** QueueAndDeque · **Tier:** Core Interview (High-Yield)

---

## 🔗 Resources & Visualizers
- **YouTube:** [Watch Monotonic Queue Visual Guide](https://www.youtube.com/results?search_query=Monotonic%20Queue%20algorithm%20visual%20explanation)
- **Blog / Editorial:** [CP-Algorithms / GeeksforGeeks Guide](https://www.google.com/search?q=Monotonic%20Queue%20algorithm%20tutorial%20CP%20algorithms)
- **Interactive Visualizer:** [VisuAlgo Interactive Simulation](https://visualgo.net/en)

---

## 🧠 Intuition & Mental Model
> [!TIP]
> **Core Concept:** A Monotonic Queue is a deque that maintains its elements in monotonic

A Monotonic Queue is a deque that maintains its elements in monotonic
order (increasing or decreasing).
It allows O(1) access to the minimum or maximum element in a sliding window.
Algorithm Explanation
Monotonic Increasing Queue (for minimum):
Queue always stores elements in increasing order
Front → minimum element
Back → largest candidate
Rules:
Remove bigger elements from back before adding new
Remove out-of-window element from front
Front always gives current minimum
Example: Sliding Window Minimum
Array = [4, 2, 12, 3, 1], Window size = 2

---

## 🎯 When to Use & Problem Triggers
- **Trigger 1:** When the brute-force enumeration takes quadratic time or higher and a linear/logarithmic invariant exists.
- **Trigger 2:** Common patterns involving **QueueAndDeque**, subsegments, query sequences, or optimal substructures.
- **Trigger 3:** Constraints where $N \ge 10^5$ require $O(N)$ or $O(N \log N)$ performance.

---

## 📊 Visual Explanation & Dry Run

```mermaid
graph TD
    A["Input / Problem State"] --> B["Apply Monotonic Queue"]
    B --> C["Transform Step / Invariant"]
    C --> D["Optimal Result / Output"]
```

<details>
<summary>🔍 <strong>Step-by-Step Algorithm Walkthrough</strong> (Click to expand)</summary>

1. **Initialization:** Set up boundary pointers, state variables, or base auxiliary arrays.
2. **Iteration / Traversal:** Advance through the input elements while maintaining the algorithmic invariant.
3. **State Transition:** Update the current state, dynamic array, or accumulator in $O(1)$ or $O(\log N)$.
4. **Final Result:** Extract the optimal answer from the computed state or reconstructed solution.

</details>

---

## 💻 Algorithm Code (Java)

```java
import java.util.*;

class MonotonicQueueMin {
    public static void main(String[] args) {
        int[] a = {4, 2, 12, 3, 1};
        int k = 2;

        Deque<Integer> q = new ArrayDeque<>();

        for (int i = 0; i < a.length; i++) {
            if (!q.isEmpty() && q.peekFirst() <= i - k) {
                q.pollFirst();
            }

            while (!q.isEmpty() && a[q.peekLast()] > a[i]) {
                q.pollLast();
            }

            q.addLast(i);

            if (i >= k - 1) {
                System.out.print(a[q.peekFirst()] + " ");
            }
        }
    }
}
```

---

## ⏱️ Complexity Analysis
- **Time Complexity (TC):** Typically `O(N)` or `O(N log N)` depending on auxiliary sorting or tree operations.
- **Space Complexity (SC):** Typically `O(1)` auxiliary space or `O(N)` for auxiliary arrays/tables.

---

## 🔄 Similar & Connected Algorithms
- **Related Category:** Explore other fundamental algorithms in [QueueAndDeque](../).
- **Composite Patterns:** Often combined with Prefix Sums, Binary Search on Answer, or Dynamic Programming memoization.

---

## ⚔️ Practice Questions

### 🟡 LeetCode
- [ ] [Explore Monotonic Queue Problems on LeetCode](https://leetcode.com/problemset/?search=Monotonic%20Queue%20LeetCode) — `Practice`

### 🔵 CodeChef & Codeforces
- [ ] [Practice on Codeforces Problemset](https://codeforces.com/problemset) — `Catalog`
- [ ] [Practice on CodeChef Practice Portal](https://www.codechef.com/practice) — `Catalog`
