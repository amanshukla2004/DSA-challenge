# Squares of a Sorted Array

- **Question Name:** Squares of a Sorted Array
- **Question Number:** TBD
- **Difficulty:** Easy (E)
- **Week / Day / Category:** Week 1 · Day 1 · Arrays
- **URL:** https://leetcode.com/problems/squares-of-a-sorted-array/

---

## Intuition
- The input is sorted, but squaring turns large negatives into large positives.
- So the largest square is always at one of the two ends, never in the middle.
- Compare `nums[l]²` and `nums[r]²`. The bigger one is the largest remaining square.
- Place it at the back of `ans` (index `i`), then move that pointer inward.
- Filling `ans` from right to left makes it come out sorted ascending.


## Pattern
<!-- e.g., Two Pointers, Sliding Window, Hash Map, Binary Search, DP -->


## Complexity Analysis
- **Time Complexity (TC):**
  - Bruteforce: `O(NlogN)`
  - Better: `O(N)`
  - Optimised: `O(N)`
- **Space Complexity (SC):**
  - Bruteforce: `O( 1)`
  - Better: `O(N)`
  - Optimised: `O(N)`

## Resources
- [Problem Link](https://leetcode.com/problems/squares-of-a-sorted-array/)
- <!-- Add editorial, article, or video links here -->

## Approaches
- [Bruteforce Approach](./bruteforce.java)
- [Better Approach](./better.java)
- [Optimised Approach](./optimised.java)
