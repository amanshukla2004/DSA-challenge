/**
 * Question: Squares of a Sorted Array
 * URL: https://leetcode.com/problems/squares-of-a-sorted-array/
 * Week 1 | Day 1 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int l = 0, r = n - 1;

        for (int i = n - 1; i >= 0; i--) {
            int a = nums[l] * nums[l];
            int b = nums[r] * nums[r];
            if (a > b) {
                ans[i] = a;
                l++;
            } else {
                ans[i] = b;
                r--;
            }
        }
        return ans;
    }
}
