/**
 * Question: Intersection of Two Arrays II
 * URL: https://leetcode.com/problems/intersection-of-two-arrays-ii/
 * Week 1 | Day 2 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

public int[] intersect(int[] nums1, int[] nums2) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums1)
        freq.put(x, freq.getOrDefault(x, 0) + 1);

    List<Integer> res = new ArrayList<>();
    for (int x : nums2) {
        int c = freq.getOrDefault(x, 0);
        if (c > 0) {
            res.add(x);
            freq.put(x, c - 1);
        }
    }

    int[] ans = new int[res.size()];
    for (int i = 0; i < ans.length; i++)
        ans[i] = res.get(i);
    return ans;
}
