# Sort Array By Parity

- **LeetCode Number:** TBD
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 4)*
- **URL:** [Sort Array By Parity](https://leetcode.com/problems/sort-array-by-parity/)
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
- you have to swap when left is odd and right is even
- use two pointer approach
---

## 🐢 Approach :
### Code
```java
class Solution {
    public int[] sortArrayByParity(int[] nums) {

        int n = nums.length;
        int i=0;
        int j=n-1;

        while(i<j){
            boolean left = (nums[i] % 2 == 0) ? true : false; // true -> even
            boolean right = (nums[j] % 2 == 0) ? true : false;

            if(left == true){
                if(right == true){
                    i++;
                }
                else {
                    i++;
                    j--;
                }
            }
            else {
                if(right == true){
                    //swap
                    int temp = nums[i];
                    nums[i] = nums[j];
                    nums[j] = temp;
                    i++;
                    j--; 
                }
                else {
                    j--;
                }
            }

        }

        return nums;
        
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---
