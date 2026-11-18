# Running Sum of 1d Array

- **LeetCode Number:** TBD
- **Difficulty:** Easy
- **Topic:** Prefix Sum , Arrays
- **URL:** [Running Sum of 1d Array](https://leetcode.com/problems/running-sum-of-1d-array/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Todo

---

## 📋 Question
<!-- Short summary of the problem in your own words -->
Given an array nums. We define a running sum of an array as runningSum[i] = sum(nums[0]…nums[i]).

Return the running sum of nums.

### 📏 Constraints
- <!-- Key constraints that decide the optimal time/space complexity -->

<details>
<summary><strong>💡 Hint</strong></summary>

<!-- Key observation or nudge without giving away the full solution -->

</details>

---

## 🐢 Approach 1: Best Approach : 

### Intuition
- <!-- Step-by-step brute force idea and why it is slow -->

### Code
```java

class Solution {
    public int[] runningSum(int[] nums) {
        
        int n = nums.length;

        for(int i=1; i<n; i++){
            nums[i] += nums[i-1];
        }
        return nums;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---

