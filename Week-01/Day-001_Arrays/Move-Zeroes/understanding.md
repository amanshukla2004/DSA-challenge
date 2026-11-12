# Move Zeroes

- **Question Name:** Move Zeroes
- **Question Number:** TBD
- **Difficulty:** Easy (E)
- **Week / Day / Category:** Week 1 · Day 1 · Arrays
- **URL:** https://leetcode.com/problems/move-zeroes/

---

## Intuition
Intuition: count marks the position where the next non-zero element should go. Everything before count is already non-zero and in original order.

i scans the array. When nums[i] is non-zero, swap it with nums[count], then count++.
The swap pushes any zero sitting at count toward the right, behind the non-zero element.
Zeroes are never moved on their own. They just get left behind as non-zero elements move forward.

Time: O(n), single pass.

Space: O(1), in place.




## Resources
- [Problem Link](https://leetcode.com/problems/move-zeroes/)
- <!-- Add editorial, article, or video links here -->
- [YT](https://www.youtube.com/watch?v=AgiGd763srg)


