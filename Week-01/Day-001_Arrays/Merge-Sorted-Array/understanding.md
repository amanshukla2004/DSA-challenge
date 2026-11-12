# Merge Sorted Array

- **Question Name:** Merge Sorted Array
- **Question Number:** TBD
- **Difficulty:** Easy (E)
- **Week / Day / Category:** Week 1 · Day 1 · Arrays
- **URL:** https://leetcode.com/problems/merge-sorted-array/

---

## Intuition
- `nums1` has `n` empty slots at the end. If you fill from the front, you overwrite unread elements of `nums1`.
- Fill from the back instead. The largest remaining element goes at `end`.
- Compare `nums1[i]` and `nums2[j]`, place the bigger one at `end`, move that pointer and `end` left.
- The write position `end` is never behind `i`, so no unread element of `nums1` gets overwritten.
- Loop only while `j >= 0`. If `nums2` is exhausted, the rest of `nums1` is already in place.
- The `i >= 0` check handles `nums1` running out first, so the leftover `nums2` elements get copied in.


## Pattern
<!-- e.g., Two Pointers, Sliding Window, Hash Map, Binary Search, DP -->


## Complexity Analysis
- **Time Complexity (TC):**
  - Bruteforce: `O(...)`
  - Better: `O(...)`
  - Optimised: `O(...)`
- **Space Complexity (SC):**
  - Bruteforce: `O(...)`
  - Better: `O(...)`
  - Optimised: `O(...)`

## Resources
- [Problem Link](https://leetcode.com/problems/merge-sorted-array/)
- <!-- Add editorial, article, or video links here -->

## Approaches
- [Bruteforce Approach](./bruteforce.java)
- [Better Approach](./better.java)
- [Optimised Approach](./optimised.java)
