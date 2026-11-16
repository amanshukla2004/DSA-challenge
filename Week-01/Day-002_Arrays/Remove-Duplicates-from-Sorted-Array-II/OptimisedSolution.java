/**
 * Question: Remove Duplicates from Sorted Array II
 * URL: https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/
 * Week 1 | Day 2 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

class Solution {
    public int removeDuplicates(int[] nums) {
        int i = 0;
        for (int ele : nums) {
            if (i < 2 || ele != nums[i - 2]) {
                nums[i] = ele;
                i++;
            }
        }
        return i;
    }
}
