/**
 * Question: Merge Sorted Array
 * URL: https://leetcode.com/problems/merge-sorted-array/
 * Week 1 | Day 1 | Arrays
 * Approach: Optimised
 *
 * merge from the back (optimal)
 * - **Time:** O(m + n)
 * - **Space:** O(1)
 * 
 */

class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {

        int i = m - 1;
        int j = n - 1;
        int end = m + n - 1;

        while (j >= 0) {

            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[end] = nums1[i];
                i--;
            } else {
                nums1[end] = nums2[j];
                j--;
            }
            end--;

        }
    }
}
