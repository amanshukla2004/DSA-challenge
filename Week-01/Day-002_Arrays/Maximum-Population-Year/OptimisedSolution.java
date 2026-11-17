/**
 * Question: Maximum Population Year
 * URL: https://leetcode.com/problems/maximum-population-year/
 * Week 1 | Day 2 | Arrays
 * Approach: Optimised
 * 
 */

// Approach 3: Sort births and deaths (two pointers)

// Useful if the year range is huge or unbounded, since it doesn’t depend on Y.

// Extract births[] and deaths[], sort both.
// Walk through births in order. For each birth year, count how many deaths are
// <= birth (those people are already gone).
// Population at that birth = (i + 1) - deathsSoFar.
// The max must occur at some birth year, so only check those.
// java
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
// Time: O(N log N).
// Space: O(N).
// Tie handling: births are processed in ascending order with strict >, so the
// earliest year is kept.