# Find Pivot Index

- **LeetCode Number:** 724
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Find Pivot Index](https://leetcode.com/problems/find-pivot-index/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array of integers `nums`, calculate the **pivot index** — the leftmost index where the sum of all numbers strictly to the **left** equals the sum of all numbers strictly to the **right**. Return `-1` if no such index exists.

### 📏 Constraints
- `1 <= nums.length <= 10^4`
- `-1000 <= nums[i] <= 1000`

<details>
<summary><strong>💡 Hint</strong></summary>

Total sum satisfies `totalSum = leftSum + nums[i] + rightSum`, so `rightSum = totalSum - leftSum - nums[i]` — you don't need any extra arrays!

</details>

---

## 🧠 Intuition
- At any index `i`, the array splits into three parts: `left`, `nums[i]`, and `right`.
- Since `sum = left + nums[i] + right`, once we compute `sum` in one pass, we can find `right = sum - left - nums[i]` in `O(1)` at every index while maintaining `left` incrementally!

---

## 🐢 Approach 1: Brute Force (Recompute Left & Right Sums)

### Intuition
- For every candidate index `i`, loop left (`0..i-1`) to compute `leftSum` and loop right (`i+1..n-1`) to compute `rightSum`.

### Code
```java
class Solution {
    public int pivotIndex(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            int left = 0, right = 0;
            for (int l = 0; l < i; l++) left += nums[l];
            for (int r = i + 1; r < n; r++) right += nums[r];
            if (left == right) return i;
        }
        return -1;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N^2)`
- **Space Complexity (SC):** `O(1)`

---

## ⚡ Approach 2: Better (Prefix & Suffix Sum Arrays)

### Intuition
- Precompute `prefix[i]` = sum strictly before `i`, and `suffix[i]` = sum strictly after `i`.
- Return the first index `i` where `prefix[i] == suffix[i]`.

### Code
```java
class Solution {
    public int pivotIndex(int[] nums) {
        int n = nums.length;

        int[] prefix = new int[n];
        int[] suffix = new int[n];

        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] + nums[i - 1];
        }

        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] + nums[i + 1];
        }

        for (int i = 0; i < n; i++) {
            if (suffix[i] == prefix[i])
                return i;
        }

        return -1;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)`

---

## 🚀 Approach 3: Optimised (Total Sum + Running Left Sum)

### Intuition
- `sum = left + nums[i] + right` ⇒ `right = sum - left - nums[i]`.
- Compute total `sum` once, then sweep `i = 0..n-1`: check `left == right`, and only *after* checking, add `nums[i]` to `left`.

### Code
```java
class Solution {
    public int pivotIndex(int[] nums) {
        // TC: O(n), SC: O(1)
        // sum = left + nums[i] + right
        // right = sum - left - nums[i]
        int n = nums.length;

        int sum = 0;
        for (int num : nums) {
            sum += num;
        }

        int left = 0;

        for (int i = 0; i < n; i++) {
            int right = sum - left - nums[i];
            if (left == right)
                return i;

            left += nums[i];
        }

        return -1;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---

## ⚠️ Edge Cases & Mistakes
- **Pivot at index `0` or `n - 1`:** Left sum at index `0` is `0`, right sum at index `n - 1` is `0`. Handled automatically by initializing `left = 0` and checking *before* `left += nums[i]`.
- **Negative numbers:** Because values can be negative, never assume prefix sums are monotonic (so don't try two pointers from ends).
