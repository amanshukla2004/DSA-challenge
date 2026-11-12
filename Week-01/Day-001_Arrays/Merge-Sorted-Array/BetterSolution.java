/**
 * Question: Merge Sorted Array
 * URL: https://leetcode.com/problems/merge-sorted-array/
 * Week 1 | Day 1 | Arrays
 * Solution 1: extra array (merge like merge sort)
 * - Two pointers `i`, `j` walk `nums1` and `nums2`, always taking the smaller
 * element into `ans`.
 * - When one array runs out, copy the rest of the other.
 * - Copy `ans` back into `nums1`.
 * - **Time:** O(m + n)
 * - **Space:** O(m + n)
 */

class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int[] ans = new int[m + n];
        int i = 0, j = 0, idx = 0;
        while (i < m && j < n) {
            if (nums1[i] <= nums2[j]) {
                ans[idx] = nums1[i];
                i++;
            } else {
                ans[idx] = nums2[j];
                j++;
            }
            idx++;
        }

        if (i == m) {
            while (j < n) {
                ans[idx] = nums2[j];
                idx++;
                j++;
            }
        } else {
            while (i < m) {
                ans[idx] = nums1[i];
                idx++;
                i++;
            }
        }
        for (int p = 0; p < m + n; p++) {
            nums1[p] = ans[p];
        }
    }
}
