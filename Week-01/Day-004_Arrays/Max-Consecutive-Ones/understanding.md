# Max Consecutive Ones

- **LeetCode Number:** 485
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 4)*
- **URL:** [Max Consecutive Ones](https://leetcode.com/problems/max-consecutive-ones/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Todo

---

## 📋 Question
<!-- Short summary of the problem in your own words -->



### Code
```java
class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        int count = 0;
        int cnt = 0;

        for(int ele : nums){
            if(ele == 1){
                cnt++;
                count = Math.max(count, cnt);
            }
            else {
                cnt=0;
            }
        }
        return count;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---
