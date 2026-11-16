# Find All Numbers Disappeared in an Array

- **Question Name:** Find All Numbers Disappeared in an Array
- **Question Number:** TBD
- **Difficulty:** Easy (E)
- **Week / Day / Category:** Week 1 · Day 2 · Arrays
- **URL:** https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/

---
## Intuition (simple way)

**Idea:** The array has values from `1` to `n`, and it also has `n` slots (indices `0` to `n-1`). So every number has a "home" slot: number `v` lives at index `v - 1`.

Instead of using a separate array to remember "which numbers did I see?", use the **sign of each element as a sticky note**:

- Negative at index `i` → number `i + 1` **was seen**
- Positive at index `i` → number `i + 1` **never appeared**

---

## Pass 1: Mark the seen numbers

For each element:
- Read its value (use `abs`, because it might already be negative from an earlier mark)
- Go to its home slot: `idx = abs(nums[i]) - 1`
- Make that slot negative (only if it's still positive)

Why the `if (nums[idx] > 0)` check?
- Duplicates point to the same slot twice.
- Without the check, the second visit would flip it back to positive and erase the mark.

Why `abs`?
- The value at `nums[i]` may have been turned negative as a mark, but its original number is still its magnitude.

---

## Pass 2: Read the notes

- Walk through the array.
- Any slot still **positive** was never visited, so number `i + 1` is missing.

---

## Example: `[4, 3, 2, 7, 8, 2, 3, 1]`

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

## Complexity

- **Time:** O(n) (two passes)
- **Space:** O(1) extra (the output list doesn't count)

**Catch:** It modifies the input array.

## Complexity Analysis
- **Time Complexity (TC):**
  - Bruteforce: `O(...)`
  - Better: `O(...)`
  - Optimised: `O(...)`
- **Space Complexity (SC):**
  - Bruteforce: `O(...)`
  - Better: `O(...)`
  - Optimised: `O(...)`

## Resources
- [Problem Link](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)
- <!-- Add editorial, article, or video links here -->
https://www.youtube.com/watch?v=i3Ew9X4zH5I

## Approaches
- [Bruteforce Approach](./bruteforce.java)
- [Better Approach](./better.java)
- [Optimised Approach](./optimised.java)
