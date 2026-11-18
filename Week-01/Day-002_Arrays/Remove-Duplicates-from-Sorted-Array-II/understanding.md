# Remove Duplicates from Sorted Array II

- **LeetCode Number:** 80
- **Difficulty:** Medium
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given a sorted integer array `nums`, remove some duplicates **in-place** such that each unique element appears **at most twice**. Maintain relative order and return the new length `k`.

### 📏 Constraints
- `1 <= nums.length <= 3 * 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` is sorted in non-decreasing order.

<details>
<summary><strong>💡 Hint</strong></summary>

Compare the incoming element `ele` with `nums[i - 2]` (the element 2 positions before the write pointer). Because the array is sorted, if `ele != nums[i - 2]`, then `ele` has appeared at most once so far in the valid prefix!

</details>

---

## 🧠 Intuition
- Generalize Remove Duplicates I (which allowed at most `k = 1` copy by checking `ele != nums[i - 1]`):
- For **at most `k = 2` copies**, always accept the first 2 elements (`i < 2`), and thereafter accept `ele` only if `ele != nums[i - 2]`.
- This exact pattern works for any allowed frequency `k`: `if (i < k || ele != nums[i - k])`.

---

## 🐢 Approach 1: Brute Force (Frequency Map + Rewrite)

### Intuition
- Use a `LinkedHashMap<Integer, Integer>` to count occurrences, capping each value at 2, and write the kept elements back into `nums`.

### Code
```java
import java.util.LinkedHashMap;
import java.util.Map;

class Solution {
    public int removeDuplicates(int[] nums) {
        Map<Integer, Integer> freq = new LinkedHashMap<>();
        for (int x : nums) {
            freq.put(x, Math.min(2, freq.getOrDefault(x, 0) + 1));
        }
        int i = 0;
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            for (int c = 0; c < e.getValue(); c++) {
                nums[i++] = e.getKey();
            }
        }
        return i;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)` *(violates `O(1)` in-place constraint)*

---

## ⚡ Approach 2: Better (Two Pointers + Explicit Streak Counter)

### Intuition
- Track how many times the current value has repeated in a `count` variable. Reset `count = 1` on a new value, and write whenever `count <= 2`.

### Code
```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int write = 1, count = 1;
        for (int read = 1; read < nums.length; read++) {
            if (nums[read] == nums[read - 1]) {
                count++;
            } else {
                count = 1;
            }
            if (count <= 2) {
                nums[write++] = nums[read];
            }
        }
        return write;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---

## 🚀 Approach 3: Optimised (Generalized `i - 2` Window Check)

### Intuition
- Keep write pointer `i = 0`.
- For every `ele` in `nums`: if `i < 2 || ele != nums[i - 2]`, write `nums[i++] = ele`.
- Clean, 5 lines, zero extra counter variables.

### Code
```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int i = 0;
        for (int ele : nums) {
            if (i < 2 || ele != nums[i - 2]) {
                nums[i] = ele;
                i++;
            }
        }
        return i;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---

## ⚠️ Edge Cases & Mistakes
- **Comparing with `nums[read - 2]` instead of `nums[i - 2]`:** Always compare against the **written prefix** `nums[i - 2]` because earlier elements at `read - 2` may have already been overwritten!
