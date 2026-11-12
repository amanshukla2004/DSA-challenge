/**
 * Question: Move Zeroes
 * URL: https://leetcode.com/problems/move-zeroes/
 * Week 1 | Day 1 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

class Solution {
    public void swap(int j, int i, int[] nums) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
        return;
    }

    public void moveZeroes(int[] nums) {
        int n = nums.length;
        int count = 0;

        for (int i = 0; i < n; i++) {
            if (nums[i] != 0) {
                swap(count, i, nums);
                count++;
            }
        }
    }
}
