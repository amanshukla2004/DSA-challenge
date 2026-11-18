# Intersection of Two Arrays II

- **LeetCode Number:** 350
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must appear **as many times as it shows in both arrays**, in any order.

### 📏 Constraints
- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 1000`

<details>
<summary><strong>💡 Hint</strong></summary>

Unlike LC 349 (unique intersection), here **frequencies matter**! Replace the `HashSet` with a `HashMap<Integer, Integer>` storing counts, and decrement the count on each match.

</details>

---

## 🧠 Intuition
- Count the frequency of every number in `nums1` using a `HashMap`.
- Walk through `nums2`: if a number `x` still has remaining count `> 0`, add `x` to the result and decrement its available count by `1`.

---

## 🐢 Approach 1: Brute Force (Nested Scan + Visited Array)

### Intuition
- For each element in `nums1`, scan `nums2` for an unmatched equal element and mark that index in `nums2` as used.

### Code
```java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        boolean[] used = new boolean[nums2.length];
        List<Integer> res = new ArrayList<>();
        for (int a : nums1) {
            for (int j = 0; j < nums2.length; j++) {
                if (!used[j] && a == nums2[j]) {
                    res.add(a);
                    used[j] = true;
                    break;
                }
            }
        }
        int[] ans = new int[res.size()];
        for (int i = 0; i < ans.length; i++) ans[i] = res.get(i);
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(n * m)`
- **Space Complexity (SC):** `O(m)`

---

## ⚡ Approach 2: Better (Sort + Two Pointers)

### Intuition
- Sort both arrays and advance two pointers `i`, `j`. Whenever `nums1[i] == nums2[j]`, add it (including duplicates!) and advance both pointers.
- Great follow-up answer when the input arrays are **already sorted** or `nums2` is too big to fit in memory!

### Code
```java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        List<Integer> res = new ArrayList<>();
        int i = 0, j = 0;
        while (i < nums1.length && j < nums2.length) {
            if (nums1[i] < nums2[j]) i++;
            else if (nums1[i] > nums2[j]) j++;
            else {
                res.add(nums1[i]);
                i++;
                j++;
            }
        }
        int[] ans = new int[res.size()];
        for (int k = 0; k < ans.length; k++) ans[k] = res.get(k);
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(n log n + m log m)`
- **Space Complexity (SC):** `O(1)` extra *(apart from sorting & output)*

---

## 🚀 Approach 3: Optimised (HashMap Frequency Counter)

### Intuition
- Build a frequency map from `nums1` (tip: build it on the *smaller* array to minimize memory).
- For every `x` in `nums2`, if `freq.getOrDefault(x, 0) > 0`, append `x` to result and decrement its count.

### Code
```java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums1)
            freq.put(x, freq.getOrDefault(x, 0) + 1);

        List<Integer> res = new ArrayList<>();
        for (int x : nums2) {
            int c = freq.getOrDefault(x, 0);
            if (c > 0) {
                res.add(x);
                freq.put(x, c - 1);
            }
        }

        int[] ans = new int[res.size()];
        for (int i = 0; i < ans.length; i++)
            ans[i] = res.get(i);
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(n + m)`
- **Space Complexity (SC):** `O(min(n, m))`

---

## ⚠️ Edge Cases & Mistakes
- **Follow-up questions in interviews:**
  - *What if arrays are already sorted?* → Use Two Pointers (`O(n + m)` time, `O(1)` space).
  - *What if `nums1` is much smaller than `nums2`?* → Hash `nums1`, stream `nums2`.
