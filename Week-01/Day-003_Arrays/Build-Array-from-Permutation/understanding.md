# Build Array from Permutation

- **LeetCode Number:** TBD
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 3)*
- **URL:** [Build Array from Permutation](https://leetcode.com/problems/build-array-from-permutation/)
- **YouTube:** [YT ](https://www.youtube.com/watch?v=0Q7m9VFCrUI)
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

## 🐢 Approach 1: Brute Force with extra space 

### Intuition
- <!-- Step-by-step brute force idea and why it is slow -->

### Code
```java
// Brute Force solution
class Solution {
    public int[] buildArray(int[] nums) {
        
        int n = nums.length;
        int[] ans = new int[n];

        for(int i=0; i<n; i++){
            int idx = nums[i];
            ans[i] = nums[idx];
        }
        return ans;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(...)`
- **Space Complexity (SC):** `O(...)`

---

## ⚡ Approach 2: Better

### Intuition
- <!-- How we improve on the brute force bottleneck -->

### Code
```java
// Better solution
```

### Complexity
- **Time Complexity (TC):** `O(...)`
- **Space Complexity (SC):** `O(...)`

---


---

## ⚠️ Edge Cases & Mistakes
- <!-- Tricky inputs, off-by-one bugs, or mistakes to remember -->
