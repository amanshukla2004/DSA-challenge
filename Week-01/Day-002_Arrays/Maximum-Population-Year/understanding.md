# Maximum Population Year

- **LeetCode Number:** 1854
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Maximum Population Year](https://leetcode.com/problems/maximum-population-year/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given `logs[i] = [birth, death]`, a person counts as alive in years `birth <= x < death` (**death year is excluded**). Return the **earliest year** with the maximum population.

### 📏 Constraints
- `1 <= logs.length <= 100`
- `1950 <= birth_i < death_i <= 2050`

<details>
<summary><strong>💡 Hint</strong></summary>

Each person only changes the population at **two points**: `+1` at `birth` and `-1` at `death`. Use a **Difference Array** (or Sweep Line / sorted births & deaths)!

</details>

---

## 🧠 Intuition
- Instead of checking every person for every year, notice that population only changes at **birth** (`+1`) and **death** (`-1`).
- **Difference Array (Bounded Years `[1950, 2050]`):** Mark `delta[birth]++` and `delta[death]--`, then take a prefix sum sweep over all years.
- **Sort Births & Deaths (Unbounded Years):** Sort `births[]` and `deaths[]` separately and use two pointers — works even if years are up to `10^9`!

---

## 🐢 Approach 1: Brute Force (Per Year, Per Log)

### Intuition
- For every year from `1950` to `2050`, loop over all logs and count how many satisfy `birth <= year < death`.
- Update `ans` only on **strictly greater** (`>`), so the earliest year wins ties.
- Weakness: Breaks down if the year range or log count grows large.

### Code
```java
class Solution {
    public int maximumPopulation(int[][] logs) {
        int maxCount = 0, ans = 1950;
        for (int year = 1950; year <= 2050; year++) {
            int count = 0;
            for (int[] log : logs) {
                if (log[0] <= year && year < log[1]) count++;
            }
            if (count > maxCount) {
                maxCount = count;
                ans = year;
            }
        }
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(Y * N)` *(where `Y = 101` years, `N = logs.length`)*
- **Space Complexity (SC):** `O(1)`

---

## ⚡ Approach 2: Better (Difference Array / Prefix Sum)

### Intuition
- Each log only changes population at two points: `+1` at `birth`, `-1` at `death`. No need to touch every year in between.
- Sweep years `1950..2050` in order maintaining running sum `curr`, updating `ans` only on strictly greater `curr > maxCount`.
- **Why `-1` at `death` and not `death + 1`?** The person is NOT alive in their death year, so they drop out exactly there.

### Code
```java
class Solution {
    public int maximumPopulation(int[][] logs) {
        int[] delta = new int[2052];
        for (int[] log : logs) {
            delta[log[0]]++;
            delta[log[1]]--;
        }
        int curr = 0, maxCount = 0, ans = 1950;
        for (int year = 1950; year <= 2050; year++) {
            curr += delta[year];
            if (curr > maxCount) {
                maxCount = curr;
                ans = year;
            }
        }
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N + Y)`
- **Space Complexity (SC):** `O(Y)`

---

## 🚀 Approach 3: Optimised (Sort Births & Deaths — Two Pointers / Sweep Line)

### Intuition
- Useful even if the year range is huge or unbounded, since it does **not** depend on `Y`.
- Extract `births[]` and `deaths[]` and sort both.
- Walk through `births` in ascending order: advance pointer `d` for all `deaths[d] <= births[i]` (people already gone).
- Alive population at `births[i]` is `(i + 1) - d`. Since the max must occur at some birth year, only check birth years.

### Code
```java
import java.util.Arrays;

class Solution {
    public int maximumPopulation(int[][] logs) {
        int n = logs.length;
        int[] births = new int[n], deaths = new int[n];
        for (int i = 0; i < n; i++) {
            births[i] = logs[i][0];
            deaths[i] = logs[i][1];
        }
        Arrays.sort(births);
        Arrays.sort(deaths);

        int d = 0, maxCount = 0, ans = births[0];
        for (int i = 0; i < n; i++) {
            while (deaths[d] <= births[i])
                d++;
            int alive = (i + 1) - d;
            if (alive > maxCount) {
                maxCount = alive;
                ans = births[i];
            }
        }
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N log N)`
- **Space Complexity (SC):** `O(N)`

---

## ⚠️ Edge Cases & Mistakes
- **Tie-breaking:** Always use strict `>` (`alive > maxCount`) while sweeping years in ascending order so the **earliest** year is preserved.
- **Death year exclusion:** In Approach 3, use `deaths[d] <= births[i]` (inclusive) because someone dying in year `X` is already NOT alive in year `X`.
