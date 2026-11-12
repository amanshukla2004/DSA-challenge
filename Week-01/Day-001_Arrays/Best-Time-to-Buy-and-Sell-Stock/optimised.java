/**
 * Question: Best Time to Buy and Sell Stock
 * URL: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
 * Week 1 | Day 1 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */

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
