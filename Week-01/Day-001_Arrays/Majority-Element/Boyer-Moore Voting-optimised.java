/**
 * Question: Majority Element
 * URL: https://leetcode.com/problems/majority-element/
 * Week 1 | Day 1 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */

// Boyer-Moore Voting
class Solution {
    public int majorityElement(int[] nums) {
        // voting algo
        int count = 0;
        int candidate = 0;
        for (int num : nums) {
            if (count == 0)
                candidate = num;

            if (num == candidate) {
                count++;
            } else {
                count--;
            }
        }
        return candidate;
    }
}
