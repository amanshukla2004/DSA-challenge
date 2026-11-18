# Third Maximum Number

- **LeetCode Number:** TBD
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 3)*
- **URL:** [Third Maximum Number](https://leetcode.com/problems/third-maximum-number/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Todo

---

## 📋 Question
<!-- Short summary of the problem in your own words -->

### 📏 Constraints
- <!-- Key constraints that decide the optimal time/space complexity -->

<details>
<summary><strong>💡 Hint</strong></summary>

<!-- Key observation or nudge without giving away the full solution -->

</details>

---

## 🧠 Intuition
<!-- Core pattern or mental model that unlocks this problem -->

---

## 🐢 Approach 1: Brute Force

### Intuition
- <!-- Step-by-step brute force idea and why it is slow -->

### Code
```java
class Solution {
    public int thirdMax(int[] nums) {
        int n = nums.length;

        Integer first = null,
        second = null,
        third = null;

        for(Integer num : nums){
            // remove duplicates
            if(num.equals(first) || num.equals(second) || num.equals(third)) continue;

            if(first == null || num > first){
                third = second;
                second = first;
                first = num;
            }
            else if(second == null || num > second){
                third = second;
                second = num;
            }
            else if(third == null || num > third){
                third = num;
            }
        }
        return third == null ? first : third;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`
