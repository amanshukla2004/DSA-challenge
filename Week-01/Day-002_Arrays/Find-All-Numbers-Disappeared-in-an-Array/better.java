/**
 * Question: Find All Numbers Disappeared in an Array
 * URL: https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/
 * Week 1 | Day 2 | Arrays
 * Approach: Better
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {

        int n = nums.length;

        for (int i = 0; i < n; i++) {
            int idx = Math.abs(nums[i]) - 1; // 0 based

            if (nums[idx] > 0) {
                nums[idx] = -nums[idx];
            }

        }

        List<Integer> ans = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            if (nums[i] > 0) {
                ans.add(i + 1);
            }
        }

        return ans;
    }
}
