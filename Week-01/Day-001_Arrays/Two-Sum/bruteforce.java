/**
 * Question: Two Sum
 * URL: https://leetcode.com/problems/two-sum/
 * Week 1 | Day 1 | Arrays
 * Approach: Bruteforce
 *
 * Time Complexity: O(N2)
 * Space Complexity: O(1)
 */

class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        for (int i = 0; i <= n - 2; i++) {
            for (int j = i + 1; j <= n - 1; j++) {
                if (nums[i] + nums[j] == target)
                    return new int[] { i, j };
            }
        }
        return new int[] { -1, -1 };
    }
}
