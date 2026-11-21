# Sum of All Odd Length Subarrays

- **LeetCode Number:** TBD
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 4)*
- **URL:** [Sum of All Odd Length Subarrays](https://leetcode.com/problems/sum-of-all-odd-length-subarrays/)
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
Let's start with brute force, the most intuitive method. We find each of the subarrays one by one, and get the sum of the current subarray if it has an odd length.

### Code
```java
class Solution {
    public int sumOddLengthSubarrays(int[] arr) {
        int n = arr.length, answer = 0;

        for (int left = 0; left < n; ++left) {
            for (int right = left; right < n; ++right) {
                if ((right - left + 1) % 2 == 1) {
                    int currentSum = 0;
                    for (int index = left; index < right + 1; ++index) {
                        currentSum += arr[index];
                    }
                    answer += currentSum;
                }
            }
        }
        return answer;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(n3)`
- **Space Complexity (SC):** `O(1)`

---

## ⚡ Approach 2: Better

### Intuition
- <!-- How we improve on the brute force bottleneck -->
Let's try a better method to reduce the workload!

For a starting index left, the difference between each of the two adjacent right indices is 1. In other words, if the current subarray is [left, right], the next subarray (if it exists) is [left, right + 1]. Therefore, we can get the sum of the next subarray by adding arr[right + 1] to the sum of the previous subarray. If the current subarray has an odd length, we can increment answer by its sum, as shown in the picture below.



Algorithm
Initialize answer as 0.
Iterate over left, the left index of the subarray.
For every subarray start at index left, we initialize current_sum = 0. We iterate over index right to fix the end of each subarray, and calculate the sum of this subarray (current_sum) by adding arr[right] to the previous current_sum. If the current subarray has an odd length, we increment answer by current_sum.

### Code
```java
// Better solution
class Solution {
    public int sumOddLengthSubarrays(int[] arr) {
        int n = arr.length, answer = 0;

        for (int left = 0; left < n; ++left) {
            int currentSum = 0;  
            for (int right = left; right < n; ++right) {
                currentSum += arr[right];
                answer += (right - left + 1) % 2 == 1 ? currentSum : 0;
            }
        }
        return answer;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(...)`
- **Space Complexity (SC):** `O(...)`

---

## 🚀 Approach 3: Optimised

### Intuition
- <!-- Optimal insight and why it achieves the best possible complexity -->
### Algorithm
- Initialize answer as 0.
- Iterate over arr, calculate the occurrence of each index i:

    - odd_left = left / 2 + 1
    - odd_right = (n - i - 1) / 2 + 1
    - even_left = (i + 1) / 2
    - even_right = (n - i) / 2
    - Add the current element arr[i] (odd_left * odd_right + even_left * even_right) times in answer.

### Code
```java
// Optimised solution
class Solution {
    public int sumOddLengthSubarrays(int[] arr) {
        int n = arr.length, answer = 0;
        
        for (int i = 0; i < n; ++i) {
            int left = i, right = n - i - 1;
            answer += arr[i] * (left / 2 + 1) * (right / 2 + 1);
            answer += arr[i] * ((left + 1) / 2) * ((right + 1) / 2);
        }
        
        return answer;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---

## ⚠️ Edge Cases & Mistakes
- <!-- Tricky inputs, off-by-one bugs, or mistakes to remember -->
