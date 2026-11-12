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

        int candidate = 0;
        int count = 0;

        for (int ele : nums) {
            if (count == 0)
                candidate = ele;
            if (ele == candidate)
                count++;
            else
                count--;
        }
        return candidate;
    }
}
