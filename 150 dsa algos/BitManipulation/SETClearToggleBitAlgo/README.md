# SET Clear Toggle Bit

> **Category:** BitManipulation · **Tier:** Core Interview (Essential)

---

## 🔗 Resources & Visualizers
- **YouTube:** [Watch SET Clear Toggle Bit Visual Guide](https://www.youtube.com/results?search_query=SET%20Clear%20Toggle%20Bit%20algorithm%20visual%20explanation)
- **Blog / Editorial:** [CP-Algorithms / GeeksforGeeks Guide](https://www.google.com/search?q=SET%20Clear%20Toggle%20Bit%20algorithm%20tutorial%20CP%20algorithms)
- **Interactive Visualizer:** [VisuAlgo Interactive Simulation](https://visualgo.net/en)

---

## 🧠 Intuition & Mental Model
> [!TIP]
> **Core Concept:** Set / Clear / Toggle are bitwise operations used to modify a specific bit of a number.

Set / Clear / Toggle are bitwise operations used to modify a specific bit of a number.
They work using bitwise OR, AND, XOR with a shifted mask.
How the Algorithm Works
Choose the bit position i (0-based, from right).
Create a mask using 1 << i.
Apply:
Set → force bit to 1
Clear → force bit to 0
Toggle → flip the bit (0↔1)
The rest of the bits remain unchanged.

---

## 🎯 When to Use & Problem Triggers
- **Trigger 1:** When the brute-force enumeration takes quadratic time or higher and a linear/logarithmic invariant exists.
- **Trigger 2:** Common patterns involving **BitManipulation**, subsegments, query sequences, or optimal substructures.
- **Trigger 3:** Constraints where $N \ge 10^5$ require $O(N)$ or $O(N \log N)$ performance.

---

## 📊 Visual Explanation & Dry Run

```mermaid
graph TD
    A["Input / Problem State"] --> B["Apply SET Clear Toggle Bit"]
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
import java.io.*;

class Main {
    public static void main(String[] args) throws Exception {
        int n = 5;

        int i = 1;

        int mask = 1 << i;

        int setResult = n | mask;
        int clearResult = n & ~mask;
        int toggleResult = n ^ mask;

        System.out.println("Original : " + n);
        System.out.println("Set Bit : " + setResult);
        System.out.println("Clear Bit : " + clearResult);
        System.out.println("Toggle Bit : " + toggleResult);

    }
}
```

---

## ⏱️ Complexity Analysis
- **Time Complexity (TC):** Typically `O(N)` or `O(N log N)` depending on auxiliary sorting or tree operations.
- **Space Complexity (SC):** Typically `O(1)` auxiliary space or `O(N)` for auxiliary arrays/tables.

---

## 🔄 Similar & Connected Algorithms
- **Related Category:** Explore other fundamental algorithms in [BitManipulation](../).
- **Composite Patterns:** Often combined with Prefix Sums, Binary Search on Answer, or Dynamic Programming memoization.

---

## ⚔️ Practice Questions

### 🟡 LeetCode
- [ ] [Explore SET Clear Toggle Bit Problems on LeetCode](https://leetcode.com/problemset/?search=SET%20Clear%20Toggle%20Bit%20LeetCode) — `Practice`

### 🔵 CodeChef & Codeforces
- [ ] [Practice on Codeforces Problemset](https://codeforces.com/problemset) — `Catalog`
- [ ] [Practice on CodeChef Practice Portal](https://www.codechef.com/practice) — `Catalog`
