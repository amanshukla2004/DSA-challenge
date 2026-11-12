import java.util.Arrays;

/**
 * Question: Squares of a Sorted Array
 * URL: https://leetcode.com/problems/squares-of-a-sorted-array/
 * Week 1 | Day 1 | Arrays
 * Approach: Bruteforce
 *
 * Time Complexity: O(NlogN)
 * Space Complexity: O(1)
 */

class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            nums[i] = nums[i] * nums[i];
        }
        Arrays.sort(nums);
        return nums;

    }
}