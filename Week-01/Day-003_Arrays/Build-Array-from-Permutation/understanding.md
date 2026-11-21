# Build Array from Permutation

- **LeetCode Number:** TBD
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 3)*
- **URL:** [Build Array from Permutation](https://leetcode.com/problems/build-array-from-permutation/)
- **YouTube:** [YT ](https://www.youtube.com/watch?v=0Q7m9VFCrUI)
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
<!-- Short summary of the problem in your own words -->

### 📏 Constraints
- <!-- Key constraints that decide the optimal time/space complexity -->

<details>
<summary><strong>💡 Hint</strong></summary>

<!-- Key observation or nudge without giving away the full solution -->

</details>

---

## 🧠 Intuition
<!-- Core pattern or mental model that unlocks this problem -->

---

## 🐢 Approach 1: Brute Force with extra space 

### Intuition
- <!-- Step-by-step brute force idea and why it is slow -->

### Code
```java
// Brute Force solution
class Solution {
    public int[] buildArray(int[] nums) {
        
        int n = nums.length;
        int[] ans = new int[n];

        for(int i=0; i<n; i++){
            int idx = nums[i];
            ans[i] = nums[idx];
        }
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(...)`
- **Space Complexity (SC):** `O(...)`

---
## Approach 2 : Optimised with O(1) space


```java
class Solution {
    public int[] buildArray(int[] nums) {
        int n = nums.length;
        int mod = 100000;

        for(int i=0; i<n; i++){
            int original = nums[i];
            int newval = nums[original];

            nums[i] = original + mod*(newval%mod);
        }


        for(int i=0; i<n; i++){
            nums[i] = nums[i]/mod;
        }

        return nums;
    }

}

```

The `// ?` line packs two numbers into one `int` slot, so the array can hold the old value and the new value at the same time.

## Brute force first
- Make a new array `ans`, then do `ans[i] = nums[nums[i]]`.
- That's `O(n)` time and `O(n)` space.
- The follow-up asks for `O(1)` extra space, so you have to store the answer inside `nums` itself.

## The problem with overwriting in place
- If you write `nums[i] = nums[nums[i]]`, you destroy the old `nums[i]`.
- A later index `j` may need that old `nums[i]`, and it's gone.
- So each slot must hold both the old value (still needed by later indices) and the new value (the answer).

## The trick: store two numbers in one slot
- Think of a two-digit number in base `M`: `value = old + M * new`.
- `old` is the ones digit and `new` is the tens digit.
- This only works if `old < M`, so the ones digit never spills into the tens digit.
- To extract either part:
  - `value % M` gives `old`
  - `value / M` gives `new`

## Mapping it to your line
```java
nums[i] = original + mod * (newval % mod);
```
- `original` is the old value, the ones digit.
- `newval` is the target, `nums[nums[i]]`, which goes in the tens digit: `mod * newval`.
- `+ original` keeps the old value in the ones digit.

## Why `newval % mod` and not just `newval`
- When you process index `i`, the slot `nums[original]` may already have been encoded, if `original < i`.
- An encoded slot looks like `old + mod*new`, which is not the raw value.
- `% mod` strips off the tens digit and gives back that slot's old value.
- If the slot hasn't been encoded yet, it's already below `mod`, so `% mod` changes nothing. That's why it's safe in both cases.
- `original = nums[i]` is always raw, because slot `i` is only modified during iteration `i`.

## Dry run: `nums = [0,2,1,5,3,4]`, `M = 6`
- `i=0`: original=0, newval=0 → `0 + 6*0 = 0`
- `i=1`: original=2, newval=nums[2]=1 → `2 + 6*1 = 8`
- `i=2`: original=1, newval=nums[1]=**8** → `8 % 6 = 2` → `1 + 6*2 = 13`
- `i=3`: original=5, newval=4 → `5 + 6*4 = 29`
- `i=4`: original=3, newval=nums[3]=29 → `29 % 6 = 5` → `3 + 6*5 = 33`
- `i=5`: original=4, newval=nums[4]=33 → `33 % 6 = 3` → `4 + 6*3 = 22`
- Array is now `[0, 8, 13, 29, 33, 22]`.
- Second loop, `/6`: `[0, 1, 2, 4, 5, 3]`, which is correct.
- The `i=2` step is the one to remember. It read an already encoded 8 and `%` recovered the raw 2.

## About your `mod`
- `mod` must be greater than the largest value in `nums`. The constraint is `nums[i] < n`, so `mod = n` is enough, and that's what the image uses.
- Your `100000` also works. The max encoded value is about `999 + 100000*999 ≈ 10^8`, well under the int limit of about `2.1 * 10^9`.
- Prefer `mod = n`. It's tighter, and it keeps the value at most `n² - 1`, so it never overflows.

## One-liner to memorize
- Encode: `slot = old + M * new`
- Read old: `slot % M`
- Read new: `slot / M`
- While encoding, always read other slots with `% M`.