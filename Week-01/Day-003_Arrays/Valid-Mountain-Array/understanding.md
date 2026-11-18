# Valid Mountain Array

- **LeetCode Number:** TBD
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 3)*
- **URL:** [Valid Mountain Array](https://leetcode.com/problems/valid-mountain-array/)
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
    public boolean validMountainArray(int[] arr) {
        int n = arr.length;

        int i=0;
        int j=n-1;

        while(i<n-1 && arr[i] < arr[i+1]) i++;
        while(j>0 && (arr[j] < arr[j-1]) ) j--;
        

        return (i == j && i != 0 && j != n-1);
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`
