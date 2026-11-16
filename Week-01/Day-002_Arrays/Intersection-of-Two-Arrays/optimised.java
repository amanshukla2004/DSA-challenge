/**
 * Question: Intersection of Two Arrays
 * URL: https://leetcode.com/problems/intersection-of-two-arrays/
 * Week 1 | Day 2 | Arrays
 * Approach: Optimised
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(n)
 * 
 */

public int[] intersection(int[] nums1, int[] nums2) {
    Set<Integer> set1 = new HashSet<>();
    for (int x : nums1)
        set1.add(x);

    List<Integer> res = new ArrayList<>();
    for (int x : nums2) {
        if (set1.remove(x)) { // true only if it was present
            res.add(x);
        }
    }

    int[] ans = new int[res.size()];
    for (int i = 0; i < ans.length; i++)
        ans[i] = res.get(i);
    return ans;
}