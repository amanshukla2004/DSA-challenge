# Intersection of Two Arrays

- **LeetCode Number:** 349
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given two integer arrays `nums1` and `nums2`, return an array of their **intersection**. Each element in the result must be **unique** and you may return the result in any order.

### 📏 Constraints
- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 1000`

<details>
<summary><strong>💡 Hint</strong></summary>

Put all elements of `nums1` into a `HashSet`. When iterating `nums2`, use `set1.remove(x)` — it checks membership AND prevents duplicate insertions in one `O(1)` call!

</details>

---

## 🧠 Intuition
- **Core problem:** Brute force is slow because for every element in `nums1`, you re-scan all of `nums2` just to answer: *"does this value exist?"*
- **Fix:** A `HashSet` acts like a **guest list at a door** answering *"does X exist?"* in `O(1)` average time.
- **Why `remove(x)` instead of `contains(x)`?**
  - The result must be unique, but `nums2` can have duplicates (e.g. `[9, 9]`).
  - With `remove(x)`, the first `9` is removed and returns `true` (add it). The second `9` returns `false` (skip). One call does two jobs!

---

## 🐢 Approach 1: Brute Force (Nested Loops)

### Intuition
- For each `a` in `nums1`, loop through `nums2`.
- If `a == b` and `a` isn't already in `res`, add it and break.

### Code
```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        List<Integer> res = new ArrayList<>();
        for (int a : nums1) {
            for (int b : nums2) {
                if (a == b && !res.contains(a)) {
                    res.add(a);
                    break;
                }
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
- **Time Complexity (TC):** `O(n * m)` *(plus `res.contains` scan)*
- **Space Complexity (SC):** `O(1)` extra *(apart from output)*

---

## ⚡ Approach 2: Better (Sort + Two Pointers)

### Intuition
- If both arrays are sorted, equal elements line up.
- Walk two pointers `i = 0, j = 0`:
  - `nums1[i] < nums2[j]` → `i++`
  - `nums1[i] > nums2[j]` → `j++`
  - Equal → add only if different from last added value, then `i++, j++`.

### Code
```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        List<Integer> res = new ArrayList<>();
        int i = 0, j = 0;
        while (i < nums1.length && j < nums2.length) {
            if (nums1[i] < nums2[j])
                i++;
            else if (nums1[i] > nums2[j])
                j++;
            else {
                if (res.isEmpty() || res.get(res.size() - 1) != nums1[i]) {
                    res.add(nums1[i]);
                }
                i++;
                j++;
            }
        }
        int[] ans = new int[res.size()];
        for (int k = 0; k < ans.length; k++)
            ans[k] = res.get(k);
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(n log n + m log m)`
- **Space Complexity (SC):** `O(1)` extra *(apart from sorting & output)*

---

## 🚀 Approach 3: Optimised (HashSet with `remove(x)`)

### Intuition
1. Put every element of `nums1` into `set1`.
2. Loop through `nums2`: if `set1.remove(x)` returns `true`, add `x` to `res`.
3. Convert `res` to `int[]` and return.

### Code
```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set1 = new HashSet<>();
        for (int x : nums1)
            set1.add(x);

        List<Integer> res = new ArrayList<>();
        for (int x : nums2) {
            if (set1.remove(x)) { // true only if it was present
                res.add(x);
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
- **Space Complexity (SC):** `O(n)`

---

## ⚠️ Edge Cases & Mistakes
- **Duplicates in `nums2`:** Using `set1.contains(x)` without removing causes duplicates in the result. Always use `set1.remove(x)` or a second result set.
