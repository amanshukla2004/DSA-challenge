# Remove Duplicates from Sorted Array

- **LeetCode Number:** 26
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given a sorted integer array `nums`, remove duplicates **in-place** such that each unique element appears only once and relative order is kept. Return `k`, the number of unique elements, with the first `k` slots of `nums` holding the unique values.

### 📏 Constraints
- `1 <= nums.length <= 3 * 10^4`
- `-100 <= nums[i] <= 100`
- `nums` is sorted in non-decreasing order.

<details>
<summary><strong>💡 Hint</strong></summary>

Because the array is **sorted**, all duplicates are adjacent! Compare the scanner `arr[j]` against the last written unique element `arr[i - 1]`.

</details>

---

## 🧠 Intuition
- Since `nums` is sorted, identical elements are always grouped side-by-side.
- Maintain a slow write pointer `i` marking the next slot for a unique element, and a fast pointer `j` scanning forward.
- Whenever `arr[j] != arr[i - 1]`, we found a new unique value — write it at `arr[i]` and advance `i`.

---

## 🐢 Approach 1: Brute Force (PriorityQueue Deduplication)

### Intuition
- Insert elements into a Min-Heap (`PriorityQueue`) only if `!pq.contains(ele)`, then poll them back into `nums`.
- Note: `pq.contains(ele)` takes `O(N)` per element.

### Code
```java
import java.util.PriorityQueue;

class Solution {
    public int removeDuplicates(int[] nums) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int ele : nums) {
            if (!pq.contains(ele))
                pq.add(ele);
        }
        int count = pq.size();
        int i = 0;
        while (pq.size() > 0) {
            int ele = pq.remove();
            nums[i] = ele;
            i++;
        }
        return count;
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N^2)` *(due to `pq.contains`)*
- **Space Complexity (SC):** `O(N)`

---

## ⚡ Approach 2: Better (LinkedHashSet)

### Intuition
- Insert all numbers into a `LinkedHashSet` (which preserves insertion order and removes duplicates in `O(1)` avg), then write back into `nums`.

### Code
```java
import java.util.LinkedHashSet;
import java.util.Set;

class Solution {
    public int removeDuplicates(int[] nums) {
        Set<Integer> set = new LinkedHashSet<>();

        for (int num : nums) {
            set.add(num);
        }

        int i = 0;
        for (int num : set) {
            nums[i++] = num;
        }

        return set.size();
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)`

---

## 🚀 Approach 3: Optimised (In-Place Two Pointers)

### Intuition
- `arr[0]` is always unique, so start write pointer `i = 1`.
- Scan `j` from `1` to `n - 1`. If `arr[j] != arr[i - 1]`, assign `arr[i] = arr[j]` and increment `i`.
- Return `i` (total unique count).

### Code
```java
class Solution {
    public int removeDuplicates(int[] arr) {
        int n = arr.length;

        int i = 1;
        for (int j = 1; j < n; j++) {
            if (arr[i - 1] != arr[j]) {
                arr[i] = arr[j];
                i++;
            }
        }
        return i;
    }
}
```

<details>
<summary><strong>Alternative Style (using <code>curr = 0</code>)</strong></summary>

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int n = nums.length;
        int curr = 0;

        for (int i = 0; i < n; i++) {
            if (nums[curr] == nums[i]) {
                continue;
            } else {
                curr++;
                nums[curr] = nums[i];
            }
        }
        return curr + 1;
    }
}
```

</details>

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(1)`

---

## ⚠️ Edge Cases & Mistakes
- **Return value:** Return `i` (the *count* of unique elements), not the last index `i - 1`.
- **Single-element array:** `i = 1`, loop doesn't execute, returns `1` correctly.
