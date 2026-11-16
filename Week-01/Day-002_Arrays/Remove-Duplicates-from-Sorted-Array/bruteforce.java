/**
 * Question: Remove Duplicates from Sorted Array
 * URL: https://leetcode.com/problems/remove-duplicates-from-sorted-array/
 * Week 1 | Day 2 | Arrays
 * Approach: Bruteforce
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

class Solution {
    public int removeDuplicates(int[] nums) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int ele : nums) {
            if (!pq.contains(ele))
                pq.add(ele);
        }
        int count = pq.size();
        int i = 0;
        while (pq.size() > 0) {
            int ele = pq.remove();
            nums[i] = ele;
            i++;
        }
        return count;
    }
}
