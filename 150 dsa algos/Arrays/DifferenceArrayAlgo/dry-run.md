# Difference Array — Step-by-Step Dry Run

> [!TIP]
> This is a companion dry-run note for **Difference Array Algorithm**. Notice how range updates take $O(1)$ time without modifying every intermediate element!

---

## 🎯 Example Walkthrough
Given an initial array of size $N = 5$ with all zeros:
```
Index:    0    1    2    3    4
Array:  [ 0,   0,   0,   0,   0 ]
```

### Operations to perform:
1. **Op 1:** Add `+10` to range `[1, 3]`
2. **Op 2:** Add `+5` to range `[2, 4]`

---

## ⚡ Execution Trace

### Step 1: Initialize Difference Array `diff` (size $N + 1$)
```
Index:    0    1    2    3    4    5
diff:   [ 0,   0,   0,   0,   0,   0 ]
```

### Step 2: Apply Range Updates in $O(1)$
- **Update 1:** `l = 1, r = 3, val = 10`
  - `diff[1] += 10`
  - `diff[4] -= 10`
  ```
  diff: [ 0,  10,   0,   0, -10,   0 ]
  ```

- **Update 2:** `l = 2, r = 4, val = 5`
  - `diff[2] += 5`
  - `diff[5] -= 5`
  ```
  diff: [ 0,  10,   5,   0, -10,  -5 ]
  ```

---

## 📊 Step 3: Prefix Sum Sweep ($O(N)$)
We take the running prefix sum of `diff` to reconstruct the final array values:

| Index | `diff[i]` | Prefix Calculation | Final Value `A[i]` |
|:---:|:---:|:---|:---:|
| **0** | `0` | $0$ | **`0`** |
| **1** | `+10` | $0 + 10$ | **`10`** |
| **2** | `+5` | $10 + 5$ | **`15`** |
| **3** | `0` | $15 + 0$ | **`15`** |
| **4** | `-10` | $15 - 10$ | **`5`** |

**Final Output Array:**
`[0, 10, 15, 15, 5]`

---

## 🧠 Key Takeaways
- **No $O(K \times N)$ loops:** 100,000 range updates take **$O(1)$ each**, running in milliseconds instead of timing out (TLE)!
- **Prefix Rebuild:** Reconstructing the array takes a single $O(N)$ pass at the end.
