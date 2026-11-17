/**
 * Question: Maximum Population Year
 * URL: https://leetcode.com/problems/maximum-population-year/
 * Week 1 | Day 2 | Arrays
 * Approach: Better
 */

// Approach 2: Difference array (prefix sum)

// Observation: Each log only changes the population at two points: +1 at birth, -1 at death. No need to touch every year in between.

// Make an array delta indexed by year.
// For each log: delta[birth]++, delta[death]--.
// Sweep years in order, keep a running sum (the population in that year).
// Track the max, again updating only on strictly greater.
// java

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
// Time: O(N + Y).
// Space: O(Y).
// Why death is -1 at death, not death + 1: the person is not alive in their death year, so they drop out exactly there.