# In-Place Encoding (Value Packing) Trick

## One-line explanation

Store **two values in one array cell** so you can read the old value and write the new value without using an extra array.

## Core idea

Pick a multiplier `M` greater than the max possible value. Then:

```java
encoded  = newValue * M + oldValue;   // pack
oldValue = encoded % M;               // unpack old
newValue = encoded / M;               // unpack new
```

Think of it as a two-digit number in base `M`: `newValue` is the upper digit and `oldValue` is the lower digit.

**Bit version** (when `M` is a power of 2, e.g. `M = 1024 = 2^10`):

```java
encoded  = (newValue << 10) | oldValue;
oldValue = encoded & 1023;
newValue = encoded >> 10;
```

## Why it works

- Reading the old value is still possible after you write the new one, because both live in the same cell.
- No extra array, so space drops from O(n) to **O(1)**.
- Time stays O(n).

## Brute force vs optimized

| Approach | Time | Space |
|---|---|---|
| Create a new array, copy interleaved values | O(n) | O(n) |
| Encode two values in one cell, decode later | O(n) | O(1) |

## Rules to remember

- `M` must be **strictly greater** than the max value, otherwise decoding breaks.
- Check **overflow**: `maxValue * M + maxValue` must fit in `int`, otherwise use `long`.
- Be careful with **negative values**, since `%` and `/` behave differently for them.
- Always do a **separate decode pass** at the end.

## Example 1: Shuffle the Array (LeetCode 1470)

Constraint: `1 <= nums[i] <= 1000`, so `M = 1024` is safe.

```java
// Pass 1: pack the right-half value and its left-half partner into the right cell
for (int i = n; i < len; i++)
    nums[i] = nums[i] * 1024 + nums[i - n];

// Pass 2: unpack and place in the final positions
int index = 0;
for (int i = n; i < len; i++, index += 2) {
    nums[index]     = nums[i] % 1024;   // x
    nums[index + 1] = nums[i] / 1024;   // y
}
```

## Example 2: Build Array from Permutation (LeetCode 1920)

Goal: `ans[i] = nums[nums[i]]`, in place. Use `M = n` (all values are in `0..n-1`).

```java
int n = nums.length;
for (int i = 0; i < n; i++)
    nums[i] += n * (nums[nums[i]] % n);   // % n recovers the old value of nums[nums[i]]
for (int i = 0; i < n; i++)
    nums[i] /= n;
```

## Example 3: Game of Life (LeetCode 289)

Each cell has an old state and a new state, each 0 or 1. Store the new state in bit 1.

```java
// encode: board[i][j] |= (newState << 1)
// decode old: board[i][j] & 1      (use this while counting neighbors)
// final:      board[i][j] >> 1
```

Neighbors are always read with `& 1`, so updates in earlier cells don't corrupt later calculations.

## Related variant: marking with sign or offset

The same principle (store extra info inside the existing cell) is used here:

- **Find All Duplicates in an Array (442):** negate `nums[abs(x) - 1]` to mark "seen".
- **Find All Numbers Disappeared in an Array (448):** same idea, mark by negation or `+= n`.
- **Set Matrix Zeroes (73):** use the first row and column as flag storage.

## When to think of this trick

- The problem says **"in-place"** or **"O(1) extra space"**.
- Each cell's **new value depends on its old value** (or neighbors' old values), so you cannot overwrite it directly.
- The values have a **small, known range** (e.g. `<= 1000`, or `0..n-1`).
- You need to read the old state and write the new state in the same pass.

## Problems covered

| # | Problem | Variant |
|---|---|---|
| 1470 | Shuffle the Array | Multiplier / bit packing |
| 1920 | Build Array from Permutation | Multiplier `M = n` |
| 289 | Game of Life | Bit packing (old and new state) |
| 442 | Find All Duplicates in an Array | Sign marking |
| 448 | Find All Numbers Disappeared in an Array | Sign / offset marking |
| 73 | Set Matrix Zeroes | Flags stored in the matrix itself |