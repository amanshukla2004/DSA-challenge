# Shuffle the Array

- **LeetCode Number:** 1470
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 4)*
- **URL:** [Shuffle the Array](https://leetcode.com/problems/shuffle-the-array/)
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

## 🐢 Approach 1: Extra space

### Intuition
- <!-- Step-by-step brute force idea and why it is slow -->

### Code
```java
// Brute Force solution
class Solution {
    public int[] shuffle(int[] nums, int n) {

        // extra space 
        int[] arr = new int[2*n];
        int k = 0;

        for(int i=0; i<n; i++){

            arr[k] = nums[i];
            k++;
            arr[k] = nums[i+n];
            k++;

        }
        return arr;
    }
}

```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)`

---

## ⚡ Approach 2: In-place (imp)
## In-Place Encoding (Value Packing) Trick

### Intuition
- <!-- How we improve on the brute force bottleneck -->

### Code

```java
// Better solution
//# In-Place Encoding (Value Packing) Trick

class Solution {
    public int[] shuffle(int[] nums, int n) {
        int M = 10000; // > 1000 (max value)

        // encode: low part = left value, high part = right value
        for (int i = n; i < 2 * n; i++) {
            int x = nums[i - n];   // left half value
            int y = nums[i];       // right half value
            nums[i] = x + y * M;
        }

        // decode
        int idx = 0;
        for (int i = n; i < 2 * n; i++) {
            nums[idx]     = nums[i] % M;  // x
            nums[idx + 1] = nums[i] / M;  // y
            idx += 2;
        }
        return nums;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(...)`
- **Space Complexity (SC):** `O(...)`

---
