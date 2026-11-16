/**
 * Question: Intersection of Two Arrays
 * URL: https://leetcode.com/problems/intersection-of-two-arrays/
 * Week 1 | Day 2 | Arrays
 * Approach: Bruteforce
 *
 * Time: O(n × m), plus the contains cost on the result
 * Space: O(1) extra, apart from the output
 * 
 * 
 * 
 * 
 * 
 * 
 * Intuition: For every element in nums1, scan nums2 to see if it exists. If
 * yes, add it to the result (once).
 * 
 * For each a in nums1, loop through nums2.
 * If a == b, and a isn’t already in the result, add it.
 * The “already in result” check is another scan over the result list.
 */

public int[] intersection(int[] nums1, int[] nums2) {
    List<Integer> res = new ArrayList<>();
    for (int a : nums1) {
        for (int b : nums2) {
            if (a == b && !res.contains(a)) {
                res.add(a);
                break;
            }
        }
    }
    int[] ans = new int[res.size()];
    for (int i = 0; i < ans.length; i++)
        ans[i] = res.get(i);
    return ans;
}
