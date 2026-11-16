/**
 * Question: Remove Duplicates from Sorted Array
 * URL: https://leetcode.com/problems/remove-duplicates-from-sorted-array/
 * Week 1 | Day 2 | Arrays
 * Approach: Better
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

class Solution {
    public int removeDuplicates(int[] nums) {
        Set<Integer> set = new LinkedHashSet<>();

        for (int num : nums) {
            set.add(num);
        }

        int i = 0;
        for (int num : set) {
            nums[i++] = num;
        }

        return set.size();
    }
}
