/**
 * Question: Maximum Population Year
 * URL: https://leetcode.com/problems/maximum-population-year/
 * Week 1 | Day 2 | Arrays
 * Approach: Bruteforce
 *
 * Time Complexity:  O(...)
 * Space Complexity: O(...)
 */

// Approach 1: Brute force (per log, per year)
// For every year from 1950 to 2050, loop over all logs.
// Count logs where birth <= year < death.
// Track max count; update only on strictly greater, so the earliest year wins ties.
// java
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
// Time: O(Y × N), where Y = 101 years, N = logs. About 10⁴ operations here.
// Space: O(1).
// Weakness: Breaks down if the year range or log count grows large.
