# Majority Element

- **LeetCode Number:** 169
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Majority Element](https://leetcode.com/problems/majority-element/)
- **YouTube:** [Majority Element — Boyer-Moore Voting](https://www.youtube.com/watch?v=1r8kzrXJiUk)
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array `nums` of size `n`, return the **majority element** — the element that appears **more than `⌊n / 2⌋` times**. You may assume that the majority element always exists in the array.

### 📏 Constraints
- `1 <= nums.length <= 5 * 10^4`
- `-10^9 <= nums[i] <= 10^9`
- Follow-up: Solve in `O(N)` time and `O(1)` space.

<details>
<summary><strong>💡 Hint</strong></summary>

If you pair up every occurrence of the majority element with a *different* element and cancel both out, the majority element is guaranteed to be the last one standing!

</details>

---

## 🧠 Intuition
- Keep one `candidate` and a `count`.
- If the next number equals `candidate`, `count++`. Otherwise `count--`, which cancels one vote of the candidate against one vote of a different number.
- If `count` hits `0`, the old candidate is fully cancelled out, so pick the current number as the new candidate.
- The majority element appears more than `n / 2` times, so the non-majority elements can't cancel all of its votes. It survives as the final candidate.

---

## 🐢 Approach 1: Brute Force (Nested Frequency Count)

### Intuition
- For each element, scan the entire array to count its occurrences.
- Return the first element whose frequency exceeds `n / 2`.

### Code
```java
class Solution {
    public int majorityElement(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) {
                if (nums[j] == nums[i]) count++;
            }
            if (count > n / 2) return nums[i];
        }
        return -1;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N^2)`
- **Space Complexity (SC):** `O(1)`

---

## ⚡ Approach 2: Better (HashMap & Sorting)

### Intuition
- **HashMap:** Track frequencies in one pass and return immediately once `freq > nums.length / 2`.
- **Sorting (Alternative):** Once sorted, any element appearing `> n / 2` times MUST occupy the middle index `nums[n / 2]`.

### Code
```java
import java.util.HashMap;

// Better Option A: HashMap — O(N) time, O(N) space
class HashMapSoln {
    public int majorityElement(int[] nums) {
        HashMap<Integer, Integer> map = new HashMap<>();
        if (nums.length == 1)
            return nums[0];
        for (int num : nums) {
            if (map.containsKey(num)) {
                int freq = map.get(num);
                if (freq + 1 > nums.length / 2)
                    return num;
                map.put(num, freq + 1); // increment count
            } else {
                map.put(num, 1); // first occurrence
            }
        }
        return -1;
    }
}
```

```java
import java.util.Arrays;

// Better Option B: Sorting — O(N log N) time, O(1) extra space
class SortingMethod {
    public int majorityElement(int[] nums) {
        Arrays.sort(nums);
        return nums[nums.length / 2];
    }
}
```

### Complexity
- **Time Complexity (TC):** HashMap `O(N)` · Sorting `O(N log N)`
- **Space Complexity (SC):** HashMap `O(N)` · Sorting `O(1)`

---

## 🚀 Approach 3: Optimised (Boyer-Moore Voting Algorithm)

### Intuition
- Track a running `candidate` and net vote balance `count`.
- Whenever `count == 0`, adopt the current element as the new candidate. Increment on match, decrement on mismatch.

### Code
```java
// Boyer-Moore Voting
class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0;
        int count = 0;

        for (int ele : nums) {
            if (count == 0)
                candidate = ele;
            if (ele == candidate)
                count++;
            else
                count--;
        }
        return candidate;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---

## ⚠️ Edge Cases & Mistakes
- **Note:** Boyer-Moore without verification is correct *only* because LeetCode guarantees a majority element exists. If it is not guaranteed, add a second pass to verify that `candidate`'s count is strictly `> n / 2`.
