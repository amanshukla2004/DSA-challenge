/**
 * Question: Best Time to Buy and Sell Stock
 * URL: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
 * Week 1 | Day 1 | Arrays
 * Approach: Bruteforce
 *
 * Time Complexity: O(n2) - TLE
 * Space Complexity: O(1)
 */

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
