/**
 * Question: Find Pivot Index
 * URL: https://leetcode.com/problems/find-pivot-index/
 * Week 1 | Day 2 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

class Solution {
    public int pivotIndex(int[] nums) {

        // TC:O(n). SC:O(1)
        // sum = left + nums[i] + right
        // right = sum - left - nums[i]
        int n = nums.length;

        int sum = 0;
        for (int num : nums) {
            sum += num;
        }

        int left = 0;

        for (int i = 0; i < n; i++) {

            int right = sum - left - nums[i];
            if (left == right)
                return i;

            left += nums[i];

        }

        return -1;

    }
}
