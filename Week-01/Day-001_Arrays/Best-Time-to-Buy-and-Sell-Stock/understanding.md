# Best Time to Buy and Sell Stock

- **LeetCode Number:** 121
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array `prices` where `prices[i]` is the price of a stock on day `i`, maximize your profit by choosing a **single day** to buy one stock and a **future day** to sell it. Return the maximum profit (or `0` if no profit is possible).

### 📏 Constraints
- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^4`

<details>
<summary><strong>💡 Hint</strong></summary>

If you decide to sell on day `i`, the best possible day to have bought is the day with the **minimum price strictly before (or up to) day `i`**.

</details>

---

## 🧠 Intuition
- *Socho ki aaj tak ka minimum kya hai.*
- *Tumne uss din khareeda tha jis din minimum tha.*
- Track `min_till_idx_i` as you walk left to right. At every day `i`, calculate `prices[i] - min_till_idx_i` and update `maxDiff`.

---

## 🐢 Approach 1: Brute Force

### Intuition
- Try every buy day `i` and every later sell day `j > i`.
- Track the maximum difference `prices[j] - prices[i]`.
- Gives **TLE** because `N <= 10^5`.

### Code
```java
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int maxDiff = -1;

        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int diff = prices[j] - prices[i];
                if (diff > maxDiff)
                    maxDiff = diff;
            }
        }
        return (maxDiff == -1) ? 0 : maxDiff;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N^2)` *(TLE)*
- **Space Complexity (SC):** `O(1)`

---

## ⚡ Approach 2: Better (Suffix Max Array)

### Intuition
- Precompute `maxRight[i]` = maximum selling price from day `i` to `n - 1`.
- Then take the max of `maxRight[i] - prices[i]` across all days.

### Code
```java
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int[] maxRight = new int[n];
        maxRight[n - 1] = prices[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            maxRight[i] = Math.max(prices[i], maxRight[i + 1]);
        }
        int maxProfit = 0;
        for (int i = 0; i < n; i++) {
            maxProfit = Math.max(maxProfit, maxRight[i] - prices[i]);
        }
        return maxProfit;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)`

---

## 🚀 Approach 3: Optimised (Running Minimum — Single Pass)

### Intuition
- Maintain `min_till_idx_i` on the fly in a single pass.
- At each index `i`, update the running minimum and check the profit if sold today: `prices[i] - min_till_idx_i`.

### Code
```java
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int maxDiff = -1;
        int min_till_idx_i = Integer.MAX_VALUE;

        for (int i = 0; i < n; i++) {
            min_till_idx_i = Math.min(min_till_idx_i, prices[i]);
            int diff = prices[i] - min_till_idx_i;
            if (diff > maxDiff)
                maxDiff = diff;
        }
        return (maxDiff == -1) ? 0 : maxDiff;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---

## ⚠️ Edge Cases & Mistakes
- **Strictly decreasing prices (e.g. `[7, 6, 4, 3, 1]`):** No profitable transaction exists, so return `0` instead of a negative profit.
- **Similar Problems:**
  - Best Time to Buy and Sell Stock II *(Medium)*
  - Best Time to Buy and Sell Stock III *(Hard)*
  - Best Time to Buy and Sell Stock IV *(Hard)*
  - Best Time to Buy and Sell Stock with Cooldown *(Medium)*
