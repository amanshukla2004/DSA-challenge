/**
 * Question: Squares of a Sorted Array
 * URL: https://leetcode.com/problems/squares-of-a-sorted-array/
 * Week 1 | Day 1 | Arrays
 * Approach: Better
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */

class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int start = 0;
        int end = n - 1;
        // Fill the answer array from END to START (reverse order)
        // This ensures larger squares go to the end first
        for (int i = n - 1; i >= 0; i--) { // travel from end
            if (Math.abs(nums[start]) >= Math.abs(nums[end])) {
                ans[i] = nums[start] * nums[start];
                start++;
            } else {
                ans[i] = nums[end] * nums[end];
                end--;
            }
        }
        return ans;
    }
}
