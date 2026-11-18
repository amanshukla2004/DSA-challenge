# Move Zeroes

- **LeetCode Number:** 283
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Move Zeroes](https://leetcode.com/problems/move-zeroes/)
- **YouTube:** [Move Zeroes Explained](https://www.youtube.com/watch?v=AgiGd763srg)
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an integer array `nums`, move all `0`'s to the end of it while maintaining the **relative order** of the non-zero elements. You must do this **in-place** without making a copy of the array.

### 📏 Constraints
- `1 <= nums.length <= 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`

<details>
<summary><strong>💡 Hint</strong></summary>

Don't try to move zeroes rightward one-by-one. Instead, collect non-zero elements at the front using a slow write pointer `count`!

</details>

---

## 🧠 Intuition
- `count` marks the position where the next non-zero element should go. Everything before `count` is already non-zero and in original order.
- `i` scans the array. When `nums[i]` is non-zero, swap it with `nums[count]`, then `count++`.
- The swap pushes any zero sitting at `count` toward the right, behind the non-zero element.
- Zeroes are never moved on their own — they just get left behind as non-zero elements move forward.

---

## 🐢 Approach 1: Brute Force (Extra Array)

### Intuition
- Copy all non-zero elements into a temporary array in order, leaving remaining trailing slots as `0`, then copy back to `nums`.

### Code
```java
class Solution {
    public void moveZeroes(int[] nums) {
        int n = nums.length;
        int[] temp = new int[n];
        int idx = 0;
        for (int x : nums) {
            if (x != 0) temp[idx++] = x;
        }
        for (int i = 0; i < n; i++) {
            nums[i] = temp[i];
        }
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)` *(violates in-place constraint)*

---

## ⚡ Approach 2: Better (Two-Pass Overwrite + Zero Fill)

### Intuition
- Pass 1: Copy every non-zero element to `nums[pos++]`.
- Pass 2: Fill remaining indices from `pos` to `n - 1` with `0`.

### Code
```java
class Solution {
    public void moveZeroes(int[] nums) {
        int pos = 0;
        for (int x : nums) {
            if (x != 0) nums[pos++] = x;
        }
        while (pos < nums.length) {
            nums[pos++] = 0;
        }
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---

## 🚀 Approach 3: Optimised (Single-Pass Two-Pointer Swap)

### Intuition
- Use `count` as the write index for the next non-zero element and `i` as the scanner.
- On every non-zero `nums[i]`, swap `nums[count]` and `nums[i]`, then increment `count`.

### Code
```java
class Solution {
    public void swap(int j, int i, int[] nums) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
        return;
    }

    public void moveZeroes(int[] nums) {
        int n = nums.length;
        int count = 0;

        for (int i = 0; i < n; i++) {
            if (nums[i] != 0) {
                swap(count, i, nums);
                count++;
            }
        }
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)` *(single pass)*
- **Space Complexity (SC):** `O(1)` *(in-place)*

---

## ⚠️ Edge Cases & Mistakes
- **All zeroes or no zeroes:** Works cleanly without extra checks (self-swaps when `i == count`).
- **Preserving order:** Never swap a zero with the *last* element of the array — that breaks relative ordering of non-zero elements.
