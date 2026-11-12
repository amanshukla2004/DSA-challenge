/**
 * Question: Two Sum
 * URL: https://leetcode.com/problems/two-sum/
 * Week 1 | Day 1 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */

class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        int[] ans = new int[2];
        HashSet<Integer> set = new HashSet<>();
        for (int i = 0; i < n; i++) {
            int a = nums[i]; // 2
            int b = target - a; // 7

            if (set.contains(b)) {
                //
                for (int j = 0; j < n; j++)
                    if (nums[j] == b)
                        return new int[] { i, j };
            } else
                set.add(a);
        }
        return ans;
    }
}
