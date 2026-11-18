# Find All Numbers Disappeared in an Array

- **LeetCode Number:** 448
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)
- **YouTube:** [Find All Disappeared Numbers Explained](https://www.youtube.com/watch?v=i3Ew9X4zH5I)
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array `nums` of `n` integers where `nums[i]` is in the range `[1, n]`, return an array of all the integers in the range `[1, n]` that **do not appear** in `nums`.

### 📏 Constraints
- `n == nums.length`
- `1 <= n <= 10^5`
- `1 <= nums[i] <= n`
- Follow-up: Do it in `O(N)` time without extra space (output list doesn't count).

<details>
<summary><strong>💡 Hint</strong></summary>

Every number `v` in `[1..n]` has a natural "home index" `v - 1`. You can either **negate** the value at index `v - 1` as a visited marker, or **Cyclic Sort** each number into its home index!

</details>

---

## 🧠 Intuition
**Idea:** The array has values from `1` to `n`, and it also has `n` slots (indices `0` to `n - 1`). So every number has a "home" slot: number `v` lives at index `v - 1`.

Instead of using a separate array to remember *"which numbers did I see?"*, use the **sign of each element as a sticky note**:
- **Negative** at index `i` → number `i + 1` **was seen**
- **Positive** at index `i` → number `i + 1` **never appeared**

### Example: `[4, 3, 2, 7, 8, 2, 3, 1]`

| Number seen | Slot marked negative |
|---|---|
| 4 | index 3 |
| 3 | index 2 |
| 2 | index 1 |
| 7 | index 6 |
| 8 | index 7 |
| 2 (dup) | index 1 (already negative, skip) |
| 3 (dup) | index 2 (already negative, skip) |
| 1 | index 0 |

Indices `4` and `5` stay positive, so the missing numbers are **5** and **6**.

---

## 🐢 Approach 1: Brute Force (Auxiliary Count Array)

### Intuition
- Allocate a `count[]` array of size `n`.
- Mark `count[nums[i] - 1] = 1` for each seen number.
- Collect all `j + 1` where `count[j] == 0`.

### Code
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int[] count = new int[nums.length];
        ArrayList<Integer> ans = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            int index = nums[i] - 1;
            count[index] = sum + 1;
        }

        for (int j = 0; j < nums.length; j++) {
            if (count[j] == 0) {
                ans.add(j + 1);
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

## ⚡ Approach 2: Better (In-Place Sign Flipping / Sticky-Note Marking)

### Intuition
- **Pass 1 (Mark):** For each element, read `idx = Math.abs(nums[i]) - 1`. Flip `nums[idx]` to negative (only if `nums[idx] > 0` so duplicates don't flip it back!).
- **Pass 2 (Collect):** Any index `i` with `nums[i] > 0` means `i + 1` never appeared.
- **Why `abs`?** `nums[i]` may have been negated as a mark, but its original value is still its magnitude.

### Code
```java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            int idx = Math.abs(nums[i]) - 1; // 0 based

            if (nums[idx] > 0) {
                nums[idx] = -nums[idx];
            }
        }

        List<Integer> ans = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            if (nums[i] > 0) {
                ans.add(i + 1);
            }
        }

        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)` *(two passes)*
- **Space Complexity (SC):** `O(1)` extra *(output list doesn't count)*

---

## 🚀 Approach 3: Optimised (Cyclic Sort)

### Intuition
- Place every number `nums[i]` into its correct home index `correctidx = nums[i] - 1` via swapping.
- Check `nums[i] != nums[correctidx]` — this automatically handles duplicates (stops infinite loops!).
- After sorting, any index `j` where `nums[j] != j + 1` reveals missing number `j + 1`.

### Code
```java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int i = 0;
        ArrayList<Integer> ans = new ArrayList<>();

        while (i < nums.length) {
            int correctidx = nums[i] - 1;
            if (nums[i] != nums[correctidx]) { // automatically takes care of duplicates
                swap(nums, i, correctidx);
            } else {
                i++;
            }
        }
        for (int j = 0; j < nums.length; j++) {
            if (nums[j] != j + 1)
                ans.add(j + 1);
        }
        return ans;
    }

    void swap(int[] nums, int i, int correctidx) {
        int temp = nums[i];
        nums[i] = nums[correctidx];
        nums[correctidx] = temp;
    }
}
```

<details>
<summary><strong>Dry Run Trace on <code>[4,3,2,7,8,2,3,1]</code></strong></summary>

```text
Index:  0 1 2 3 4 5 6 7
Start: [4,3,2,7,8,2,3,1]
swap(0,3) -> [7,3,2,4,8,2,3,1]
swap(0,6) -> [3,3,2,4,8,2,7,1]
swap(0,2) -> [2,3,3,4,8,2,7,1]
swap(0,1) -> [3,2,3,4,8,2,7,1]
...indices 4 and 5 end up without 5 and 6!
```

</details>

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)` extra

---

## ⚠️ Edge Cases & Mistakes
- **Catch:** Both in-place methods mutate the input array.
- **Double-flipping in sign-marking:** Always guard with `if (nums[idx] > 0)` (or use `nums[idx] = -Math.abs(nums[idx])`) so duplicate elements don't flip a negative mark back to positive.
