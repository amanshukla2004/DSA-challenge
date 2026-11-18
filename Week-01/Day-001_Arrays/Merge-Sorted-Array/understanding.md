# Merge Sorted Array

- **LeetCode Number:** 88
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
You are given two sorted integer arrays `nums1` (length `m + n`, with `m` valid elements followed by `n` trailing zeroes) and `nums2` (length `n`). Merge `nums2` into `nums1` **in-place** as one sorted array.

### 📏 Constraints
- `nums1.length == m + n`, `nums2.length == n`
- `0 <= m, n <= 200`
- `1 <= m + n <= 200`

<details>
<summary><strong>💡 Hint</strong></summary>

The empty buffer slots sit at the **end** of `nums1`. Merge from **right to left** placing the largest element first so you never overwrite unread elements!

</details>

---

## 🧠 Intuition
- `nums1` has `n` empty slots at the end. If you fill from the front, you overwrite unread elements of `nums1`.
- Fill from the back instead. The largest remaining element goes at `end`.
- Compare `nums1[i]` and `nums2[j]`, place the bigger one at `end`, move that pointer and `end` left.
- The write position `end` is never behind `i`, so no unread element of `nums1` gets overwritten.
- Loop only while `j >= 0`. If `nums2` is exhausted, the rest of `nums1` is already in place.
- The `i >= 0` check handles `nums1` running out first, so the leftover `nums2` elements get copied in.

---

## 🐢 Approach 1: Brute Force (Copy & Sort)

### Intuition
- Copy all elements of `nums2` into the trailing empty slots of `nums1`, then call `Arrays.sort(nums1)`.

### Code
```java
import java.util.Arrays;

class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        for (int i = 0; i < n; i++) {
            nums1[m + i] = nums2[i];
        }
        Arrays.sort(nums1);
    }
}
```

### Complexity
- **Time Complexity (TC):** `O((m + n) log(m + n))`
- **Space Complexity (SC):** `O(1)`

---

## ⚡ Approach 2: Better (Extra Array — Merge Sort Style)

### Intuition
- Two pointers `i`, `j` walk `nums1` and `nums2`, always taking the smaller element into `ans`.
- When one array runs out, copy the rest of the other, then copy `ans` back into `nums1`.

### Code
```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int[] ans = new int[m + n];
        int i = 0, j = 0, idx = 0;
        while (i < m && j < n) {
            if (nums1[i] <= nums2[j]) {
                ans[idx] = nums1[i];
                i++;
            } else {
                ans[idx] = nums2[j];
                j++;
            }
            idx++;
        }

        if (i == m) {
            while (j < n) {
                ans[idx] = nums2[j];
                idx++;
                j++;
            }
        } else {
            while (i < m) {
                ans[idx] = nums1[i];
                idx++;
                i++;
            }
        }
        for (int p = 0; p < m + n; p++) {
            nums1[p] = ans[p];
        }
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(m + n)`
- **Space Complexity (SC):** `O(m + n)`

---

## 🚀 Approach 3: Optimised (Three Pointers — Merge From the Back)

### Intuition
- Initialize `i = m - 1`, `j = n - 1`, `end = m + n - 1`.
- While `j >= 0`, place `max(nums1[i], nums2[j])` at `nums1[end--]`.

### Code
```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;
        int j = n - 1;
        int end = m + n - 1;

        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[end] = nums1[i];
                i--;
            } else {
                nums1[end] = nums2[j];
                j--;
            }
            end--;
        }
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(m + n)`
- **Space Complexity (SC):** `O(1)`

---

## ⚠️ Edge Cases & Mistakes
- **`m = 0` (all elements come from `nums2`):** Handled by `i >= 0` guard inside the `while (j >= 0)` loop.
- **`n = 0` (`nums2` is empty):** Loop never runs; `nums1` stays untouched.
