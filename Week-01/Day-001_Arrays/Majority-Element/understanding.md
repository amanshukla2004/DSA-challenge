# Majority Element

- **Question Name:** Majority Element
- **Question Number:** TBD
- **Difficulty:** Easy (E)
- **Week / Day / Category:** Week 1 · Day 1 · Arrays
- **URL:** https://leetcode.com/problems/majority-element/

---

## Intuition


- Keep one candidate and a count.
- If the next number equals the candidate, count++. Otherwise count--, which cancels one vote of the candidate against one vote of a different number.
- If count hits 0, the old candidate is fully cancelled out, so pick the current number as the new candidate.
- The majority element appears more than n/2 times, so the non-majority elements can’t cancel all of its votes. It survives as the final candidate.

- Note: This is correct only because LeetCode guarantees a majority element exists. If that’s not guaranteed, add a second pass to verify that the candidate’s count is above n/2.


## Pattern
<!-- e.g., Two Pointers, Sliding Window, Hash Map, Binary Search, DP -->


## Complexity Analysis
- **Time Complexity (TC):**
  - Bruteforce: `O(N2)`
  - HashMap: `O(N)`
  - Sorting: `O(N log N)`
  - Optimised : `O(N)`
- **Space Complexity (SC):**
  - Bruteforce: `O(1)`  
  - Better: `O(N)`
  - Optimised Boyer-Moore Voting: `O(1)`

## Resources
- [Problem Link](https://leetcode.com/problems/majority-element/)
- <!-- Add editorial, article, or video links here -->

## Approaches
- [Bruteforce Approach](./bruteforce.java)
- [Better Approach](./better.java)
- [Optimised Approach](./optimised.java)
