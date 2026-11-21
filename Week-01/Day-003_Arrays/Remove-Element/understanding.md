# Remove Element

- **LeetCode Number:** 27
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 3)*, Two pointers 
- **URL:** [Remove Element](https://leetcode.com/problems/remove-element/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** Yes
- **Status:** Solved

---

## 📋 Question
<!-- Short summary of the problem in your own words -->
Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The order of the elements may be changed. Then return the number of elements in nums which are not equal to val.

Consider the number of elements in nums which are not equal to val be k, to get accepted, you need to do the following things:

Change the array nums such that the first k elements of nums contain the elements which are not equal to val. The remaining elements of nums are not important as well as the size of nums.
Return k.



## 🐢 Best Approach : 
### Intuition
- idx will tell us the correct position of the next non target/val element 
- we iterate through the array
- if element is not equal to val, we place it at idx position and increment idx 
- otherwise, we skip it


### Code
```java
class Solution {
    public int removeElement(int[] nums, int val) {
        

        int idx = 0; // next position of the non-target element

        for(int ele : nums){
            if(ele != val){
                nums[idx] = ele;
                idx++;
            }
        }
        return idx;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

