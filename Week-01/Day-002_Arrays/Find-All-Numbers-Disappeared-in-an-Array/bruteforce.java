import java.util.ArrayList;
import java.util.List;

/**
 * Question: Find All Numbers Disappeared in an Array
 * URL: https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/
 * Week 1 | Day 2 | Arrays
 * Approach: Bruteforce
 *
 * Time Complexity: O(N + N)
 * Space Complexity: O(N)
 */

class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {

        int[] count = new int[nums.length];

        ArrayList<Integer> ans = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            int index = nums[i] - 1;
            count[index] = sum + 1;
        }

        for (int j = 0; j < nums.length; j++) {
            if (count[j] == 0) {
                ans.add(j + 1);
            }
        }
        return ans;
    }
}