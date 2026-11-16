/**
 * Question: Intersection of Two Arrays
 * URL: https://leetcode.com/problems/intersection-of-two-arrays/
 * Week 1 | Day 2 | Arrays
 * Approach: Better
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 * 
 * 
 * 2. Better: Sort + Two Pointers
 * 
 * Intuition: If both arrays are sorted, equal elements line up. Walk two
 * pointers: advance the smaller one, and record a match when equal. Skip
 * duplicates so each value is added once.
 * 
 * Sort both arrays.
 * i = 0, j = 0.
 * If nums1[i] < nums2[j] → i++
 * If nums1[i] > nums2[j] → j++
 * If equal → add it (only if it differs from the last added value), then i++,
 * j++.
 */
public int[] intersection(int[] nums1, int[] nums2) {
    Arrays.sort(nums1);
    Arrays.sort(nums2);
    List<Integer> res = new ArrayList<>();
    int i = 0, j = 0;
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] < nums2[j])
            i++;
        else if (nums1[i] > nums2[j])
            j++;
        else {
            if (res.isEmpty() || res.get(res.size() - 1) != nums1[i]) {
                res.add(nums1[i]);
            }
            i++;
            j++;
        }
    }
    int[] ans = new int[res.size()];
    for (int k = 0; k < ans.length; k++)
        ans[k] = res.get(k);
    return ans;
}
