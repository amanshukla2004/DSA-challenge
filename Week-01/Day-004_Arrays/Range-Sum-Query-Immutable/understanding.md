# Range Sum Query - Immutable

- **LeetCode Number:** TBD
- **Difficulty:** Easy
- **Topic:** Arrays, prefix sum *(Week 1 · Day 4)*
- **URL:** [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

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
// Brute Force solution
class NumArray {

    int[] arr;

    public NumArray(int[] nums) {
        arr = nums;
    }
    
    public int sumRange(int left, int right) {
        int sum = 0;
        for(int i=left; i<=right; i++){
            sum += arr[i];
        }
        return sum;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(...)`
- **Space Complexity (SC):** `O(...)`

---

## ⚡ Approach 2: Better : PreFix SUM

### Intuition
- <!-- How we improve on the brute force bottleneck -->

### Code
```java
// Better solution
// prefix sum
class NumArray {

    int[] arr;

    public NumArray(int[] nums) {
        arr = nums;

        for(int i=1; i<arr.length; i++){
            arr[i] = arr[i] + arr[i-1];
        }
    }
    
    public int sumRange(int left, int right) {
        if(left == 0) return arr[right];
        
        return arr[right] - arr[left-1];
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(...)`
- **Space Complexity (SC):** `O(...)`

---