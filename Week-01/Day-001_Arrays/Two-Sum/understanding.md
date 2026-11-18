# Two Sum

- **LeetCode Number:** 1
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Two Sum](https://leetcode.com/problems/two-sum/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`. Each input has exactly one solution, and you may not use the same element twice.

### 📏 Constraints
- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i], target <= 10^9`
- Only one valid answer exists.

<details>
<summary><strong>💡 Hint</strong></summary>

For each element `a = nums[i]`, you only need to know whether its complement `b = target - a` has already appeared — and at which index! A HashMap gives `O(1)` lookup.

</details>

---

## 🧠 Intuition
- Brute force checks every pair `(i, j)` in `O(N^2)` time.
- Instead of scanning the rest of the array for `target - nums[i]`, store previously seen values (and their indices) in a hash structure so complement lookup becomes `O(1)`.

---

## 🐢 Approach 1: Brute Force

### Intuition
- Check every possible pair `(i, j)` with `j > i`.
- If `nums[i] + nums[j] == target`, immediately return `{i, j}`.

### Code
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        for (int i = 0; i <= n - 2; i++) {
            for (int j = i + 1; j <= n - 1; j++) {
                if (nums[i] + nums[j] == target)
                    return new int[] { i, j };
            }
        }
        return new int[] { -1, -1 };
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N^2)`
- **Space Complexity (SC):** `O(1)`

---

## ⚡ Approach 2: Better (HashSet + Index Lookup)

### Intuition
- Maintain a `HashSet` of numbers seen so far.
- For each `a = nums[i]`, compute `b = target - a`. If `set.contains(b)`, scan to find `b`'s index and return `{i, j}`.

### Code
```java
import java.util.HashSet;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        int[] ans = new int[2];
        HashSet<Integer> set = new HashSet<>();
        for (int i = 0; i < n; i++) {
            int a = nums[i]; // e.g., 2
            int b = target - a; // e.g., 7

            if (set.contains(b)) {
                for (int j = 0; j < n; j++)
                    if (nums[j] == b)
                        return new int[] { i, j };
            } else
                set.add(a);
        }
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)` (one linear scan when match is found)
- **Space Complexity (SC):** `O(N)`

---

## 🚀 Approach 3: Optimised (Single-Pass HashMap)

### Intuition
- Store `value -> index` in a `HashMap` instead of just the value in a `HashSet`.
- When `target - nums[i]` is already in the map, you immediately have both indices without a second scan (and it safely handles duplicate values like `[3, 3], target = 6`).

### Code
```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] { -1, -1 };
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)`

---

## ⚠️ Edge Cases & Mistakes
- **Duplicate values (e.g. `[3, 3]`, target `6`):** Always check `containsKey(complement)` *before* inserting `nums[i]` into the map so you don't pair an index with itself.
