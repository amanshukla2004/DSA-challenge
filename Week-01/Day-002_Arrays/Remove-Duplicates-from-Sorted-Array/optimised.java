/**
 * Question: Remove Duplicates from Sorted Array
 * URL: https://leetcode.com/problems/remove-duplicates-from-sorted-array/
 * Week 1 | Day 2 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

class Solution {
    public int removeDuplicates(int[] arr) {
        int n = arr.length;

        int i = 1;
        for (int j = 1; j < n; j++) {
            if (arr[i - 1] != arr[j]) {
                arr[i] = arr[j];
                i++;
            }
        }
        return i;

    }
}

/*
 * class Solution {
 * public int removeDuplicates(int[] nums) {
 * 
 * 
 * int n = nums.length;
 * 
 * int curr = 0;
 * 
 * for(int i=0; i<n; i++){
 * if(nums[curr] == nums[i]){
 * continue;
 * }
 * else {
 * curr++;
 * nums[curr] = nums[i];
 * }
 * }
 * return curr+1;
 * }
 * }
 * 
 * 
 * 
 */
