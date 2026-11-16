# Intersection of Two Arrays

- **Question Name:** Intersection of Two Arrays
- **Question Number:** TBD
- **Difficulty:** Easy (E)
- **Week / Day / Category:** Week 1 · Day 2 · Arrays
- **URL:** https://leetcode.com/problems/intersection-of-two-arrays/

---

**Core problem:** Brute force is slow because for every element in `nums1`, you re-scan all of `nums2` just to answer one question: *"does this value exist?"*

**Fix:** Make that question cheap. A HashSet answers "does X exist?" in O(1) on average, so no more scanning.

Think of `set1` as a **guest list** at a door:
- Put every number from `nums1` on the list. Duplicates collapse automatically.
- Walk through `nums2` as people arriving.
  - On the list → part of the intersection.
  - Not on the list → ignore.

**Why `remove(x)` instead of `contains(x)`?**
- The result must be unique, but `nums2` can have duplicates.
- With `contains`, `nums2 = [9, 9]` would add `9` twice.
- With `remove`, the first `9` is removed and returns `true` (add it). The second `9` returns `false` (skip).
- So one call does two jobs: checks membership and marks the value as already used.

---

## Algorithm

1. Create an empty `HashSet<Integer> set1`.
2. Loop through `nums1` and add every element to `set1`.
3. Create an empty list `res`.
4. Loop through `nums2`:
   - If `set1.remove(x)` returns `true`, add `x` to `res`.
   - Otherwise, skip.
5. Convert `res` to an `int[]` and return it.


## Resources
- [Problem Link](https://leetcode.com/problems/intersection-of-two-arrays/)
- <!-- Add editorial, article, or video links here -->

## Approaches
- [Bruteforce Approach](./bruteforce.java)
- [Better Approach](./better.java)
- [Optimised Approach](./optimised.java)
