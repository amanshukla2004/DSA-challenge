
/**
 * Question: Majority Element
 * URL: https://leetcode.com/problems/majority-element/
 * Week 1 | Day 1 | Arrays
 * Approach: Better
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */
import java.util.HashMap;

class HashMapSoln {
    public int majorityElement(int[] nums) {
        HashMap<Integer, Integer> map = new HashMap<>();
        if (nums.length == 1)
            return nums[0];
        for (int num : nums) {
            if (map.containsKey(num)) {
                int freq = map.get(num);
                if (freq + 1 > nums.length / 2)
                    return num;
                map.put(num, freq + 1); // increment count
            } else {
                map.put(num, 1); // first occurrence
            }
        }
        return -1;
    }
}
