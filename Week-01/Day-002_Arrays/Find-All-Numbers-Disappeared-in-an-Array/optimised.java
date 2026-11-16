/**
 * Question: Find All Numbers Disappeared in an Array
 * URL: https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/
 * Week 1 | Day 2 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int i = 0;
        ArrayList<Integer> ans = new ArrayList<>();

        while (i < nums.length) {
            int correctidx = nums[i] - 1;
            if (nums[i] != nums[correctidx]) { // automatically checking and taking care of dublicate element
                swap(nums, i, correctidx);
            } else
                i++;
        }
        for (int j = 0; j < nums.length; j++) {
            if (nums[j] != j + 1)
                ans.add(j + 1);
        }
        return ans;
    }

    void swap(int[] nums, int i, int correctidx) {
        int temp = nums[i];
        nums[i] = nums[correctidx];
        nums[correctidx] = temp;
    }
}
/*
 * 0 1 2 3 4 5 6 7
 * [4,3,2,7,8,2,3,1]
 * swap (0,3) ->
 * [7,3,2,4,8,2,3,1]
 * swap(0,6) ->
 * [3,3,2,4,8,2,7,1]
 * swap(0,2) ->
 * [2,3,3,4,8,2,7,1]
 * swap(0,1) ->
 * [3,2,3,4,8,2,7,1]
 * 
 */