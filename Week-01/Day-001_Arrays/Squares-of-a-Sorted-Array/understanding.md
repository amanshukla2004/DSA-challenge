# Squares of a Sorted Array

- **LeetCode Number:** 977
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an integer array `nums` sorted in **non-decreasing order**, return an array of the **squares of each number** sorted in non-decreasing order.

### 📏 Constraints
- `1 <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` is sorted in non-decreasing order.
- Follow-up: Solve in `O(N)` time.

<details>
<summary><strong>💡 Hint</strong></summary>

Squaring negative numbers flips their order, so the **largest** square is always located at either the far left or far right end of the array!

</details>

---

## 🧠 Intuition
- The input is sorted, but squaring turns large negatives into large positives.
- So the largest square is always at one of the two ends, never in the middle.
- Compare `nums[l]²` and `nums[r]²`. The bigger one is the largest remaining square.
- Place it at the back of `ans` (index `i`), then move that pointer inward.
- Filling `ans` from right to left makes it come out sorted ascending.

---

## 🐢 Approach 1: Brute Force (Square & Sort)

### Intuition
- Square every element in-place, then run `Arrays.sort(nums)`.

### Code
```java
import java.util.Arrays;

class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            nums[i] = nums[i] * nums[i];
        }
        Arrays.sort(nums);
        return nums;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N log N)`
- **Space Complexity (SC):** `O(1)` *(ignoring sorting stack)*

---

## ⚡ Approach 2: Better (Two Pointers with `Math.abs`)

### Intuition
- Place `start = 0` and `end = n - 1`.
- Fill `ans` from `n - 1` down to `0` by comparing `Math.abs(nums[start])` vs `Math.abs(nums[end])`.

### Code
```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int start = 0;
        int end = n - 1;
        // Fill the answer array from END to START (reverse order)
        // This ensures larger squares go to the end first
        for (int i = n - 1; i >= 0; i--) {
            if (Math.abs(nums[start]) >= Math.abs(nums[end])) {
                ans[i] = nums[start] * nums[start];
                start++;
            } else {
                ans[i] = nums[end] * nums[end];
                end--;
            }
        }
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)`

---

## 🚀 Approach 3: Optimised (Two Pointers — Direct Square Comparison)

### Intuition
- Avoid `Math.abs` overhead by directly comparing `nums[l] * nums[l]` and `nums[r] * nums[r]` and placing the larger square at `ans[i]` from right to left.

### Code
```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int l = 0, r = n - 1;

        for (int i = n - 1; i >= 0; i--) {
            int a = nums[l] * nums[l];
            int b = nums[r] * nums[r];
            if (a > b) {
                ans[i] = a;
                l++;
            } else {
                ans[i] = b;
                r--;
            }
        }
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)` *(output array)*

---

## ⚠️ Edge Cases & Mistakes
- **All negative or all positive arrays:** Still handled seamlessly because one pointer simply walks through the entire array.
- **Filling from index 0 instead of `n - 1`:** We only know the *largest* remaining square at the two ends, not the smallest — so always fill `ans` backwards!
