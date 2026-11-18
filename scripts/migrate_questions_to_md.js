const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'daily_data.js');

function loadRoadmap() {
  const code = fs.readFileSync(DATA_FILE, 'utf8');
  return new Function(`${code}; return dailyRoadmap;`)();
}

function sanitizeSegment(input, maxLen = 72) {
  let s = String(input)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[<>:"/\\|?*{}]/g, ' ')
    .replace(/['`,.!()[\]]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (s.length > maxLen) {
    const cut = s.slice(0, maxLen);
    const lastHyphen = cut.lastIndexOf('-');
    s = (lastHyphen > 20 ? cut.slice(0, lastHyphen) : cut).replace(/-+$/g, '');
  }
  return s || 'item';
}

function formatWeekFolder(weekNum) {
  return `Week-${String(weekNum).padStart(2, '0')}`;
}

function formatDayFolder(dayEntry) {
  const rawDay = String(dayEntry.day).trim();
  const dayPart = /^\d+$/.test(rawDay)
    ? `Day-${rawDay.padStart(3, '0')}`
    : `Day-${sanitizeSegment(rawDay, 20)}`;
  const catPart = sanitizeSegment(dayEntry.category, 48);
  return `${dayPart}_${catPart}`;
}

function normalizeText(str) {
  return String(str).replace(/\r\n/g, '\n').trim();
}

function buildOldJavaTemplate(dayEntry, q, tier) {
  const className =
    tier === 'bruteforce'
      ? 'BruteforceSolution'
      : tier === 'better'
        ? 'BetterSolution'
        : 'OptimisedSolution';
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return `/**
 * Question: ${q.name}
 * URL: ${q.url}
 * Week ${dayEntry.week} | Day ${dayEntry.day} | ${dayEntry.category}
 * Approach: ${tierLabel}
 *
 * Time Complexity:  O(...)
 * Space Complexity: O(...)
 */

public class ${className} {
    public static void main(String[] args) {
        // TODO: Add test cases for ${q.name} (${tierLabel})
    }
}
`;
}

function buildNewDsaTemplate(dayEntry, q) {
  const diffLabel = q.diff === 'E' ? 'Easy' : q.diff === 'M' ? 'Medium' : q.diff === 'H' ? 'Hard' : (q.diff || 'DSA');
  return `# ${q.name}

- **LeetCode Number:** TBD
- **Difficulty:** ${diffLabel}
- **Topic:** ${dayEntry.category} *(Week ${dayEntry.week} · Day ${dayEntry.day})*
- **URL:** [${q.name}](${q.url})
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
\`\`\`java
// Brute Force solution
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(...)\`
- **Space Complexity (SC):** \`O(...)\`

---

## ⚡ Approach 2: Better

### Intuition
- <!-- How we improve on the brute force bottleneck -->

### Code
\`\`\`java
// Better solution
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(...)\`
- **Space Complexity (SC):** \`O(...)\`

---

## 🚀 Approach 3: Optimised

### Intuition
- <!-- Optimal insight and why it achieves the best possible complexity -->

### Code
\`\`\`java
// Optimised solution
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(...)\`
- **Space Complexity (SC):** \`O(...)\`

---

## ⚠️ Edge Cases & Mistakes
- <!-- Tricky inputs, off-by-one bugs, or mistakes to remember -->
`;
}

/**
 * Hand-crafted Markdown files for all 13 solved questions (Day 1 & Day 2),
 * preserving 100% of the user's code, notes, comments, and YouTube links.
 */
const SOLVED_MD_BY_RELPATH = {
  'Week-01/Day-001_Arrays/Two-Sum': `# Two Sum

- **LeetCode Number:** 1
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Two Sum](https://leetcode.com/problems/two-sum/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`. Each input has exactly one solution, and you may not use the same element twice.

### 📏 Constraints
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i], target <= 10^9\`
- Only one valid answer exists.

<details>
<summary><strong>💡 Hint</strong></summary>

For each element \`a = nums[i]\`, you only need to know whether its complement \`b = target - a\` has already appeared — and at which index! A HashMap gives \`O(1)\` lookup.

</details>

---

## 🧠 Intuition
- Brute force checks every pair \`(i, j)\` in \`O(N^2)\` time.
- Instead of scanning the rest of the array for \`target - nums[i]\`, store previously seen values (and their indices) in a hash structure so complement lookup becomes \`O(1)\`.

---

## 🐢 Approach 1: Brute Force

### Intuition
- Check every possible pair \`(i, j)\` with \`j > i\`.
- If \`nums[i] + nums[j] == target\`, immediately return \`{i, j}\`.

### Code
\`\`\`java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        for (int i = 0; i <= n - 2; i++) {
            for (int j = i + 1; j <= n - 1; j++) {
                if (nums[i] + nums[j] == target)
                    return new int[] { i, j };
            }
        }
        return new int[] { -1, -1 };
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N^2)\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚡ Approach 2: Better (HashSet + Index Lookup)

### Intuition
- Maintain a \`HashSet\` of numbers seen so far.
- For each \`a = nums[i]\`, compute \`b = target - a\`. If \`set.contains(b)\`, scan to find \`b\`'s index and return \`{i, j}\`.

### Code
\`\`\`java
import java.util.HashSet;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        int[] ans = new int[2];
        HashSet<Integer> set = new HashSet<>();
        for (int i = 0; i < n; i++) {
            int a = nums[i]; // e.g., 2
            int b = target - a; // e.g., 7

            if (set.contains(b)) {
                for (int j = 0; j < n; j++)
                    if (nums[j] == b)
                        return new int[] { i, j };
            } else
                set.add(a);
        }
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\` (one linear scan when match is found)
- **Space Complexity (SC):** \`O(N)\`

---

## 🚀 Approach 3: Optimised (Single-Pass HashMap)

### Intuition
- Store \`value -> index\` in a \`HashMap\` instead of just the value in a \`HashSet\`.
- When \`target - nums[i]\` is already in the map, you immediately have both indices without a second scan (and it safely handles duplicate values like \`[3, 3], target = 6\`).

### Code
\`\`\`java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] { -1, -1 };
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(N)\`

---

## ⚠️ Edge Cases & Mistakes
- **Duplicate values (e.g. \`[3, 3]\`, target \`6\`):** Always check \`containsKey(complement)\` *before* inserting \`nums[i]\` into the map so you don't pair an index with itself.
`,

  'Week-01/Day-001_Arrays/Best-Time-to-Buy-and-Sell-Stock': `# Best Time to Buy and Sell Stock

- **LeetCode Number:** 121
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array \`prices\` where \`prices[i]\` is the price of a stock on day \`i\`, maximize your profit by choosing a **single day** to buy one stock and a **future day** to sell it. Return the maximum profit (or \`0\` if no profit is possible).

### 📏 Constraints
- \`1 <= prices.length <= 10^5\`
- \`0 <= prices[i] <= 10^4\`

<details>
<summary><strong>💡 Hint</strong></summary>

If you decide to sell on day \`i\`, the best possible day to have bought is the day with the **minimum price strictly before (or up to) day \`i\`**.

</details>

---

## 🧠 Intuition
- *Socho ki aaj tak ka minimum kya hai.*
- *Tumne uss din khareeda tha jis din minimum tha.*
- Track \`min_till_idx_i\` as you walk left to right. At every day \`i\`, calculate \`prices[i] - min_till_idx_i\` and update \`maxDiff\`.

---

## 🐢 Approach 1: Brute Force

### Intuition
- Try every buy day \`i\` and every later sell day \`j > i\`.
- Track the maximum difference \`prices[j] - prices[i]\`.
- Gives **TLE** because \`N <= 10^5\`.

### Code
\`\`\`java
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int maxDiff = -1;

        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int diff = prices[j] - prices[i];
                if (diff > maxDiff)
                    maxDiff = diff;
            }
        }
        return (maxDiff == -1) ? 0 : maxDiff;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N^2)\` *(TLE)*
- **Space Complexity (SC):** \`O(1)\`

---

## ⚡ Approach 2: Better (Suffix Max Array)

### Intuition
- Precompute \`maxRight[i]\` = maximum selling price from day \`i\` to \`n - 1\`.
- Then take the max of \`maxRight[i] - prices[i]\` across all days.

### Code
\`\`\`java
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int[] maxRight = new int[n];
        maxRight[n - 1] = prices[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            maxRight[i] = Math.max(prices[i], maxRight[i + 1]);
        }
        int maxProfit = 0;
        for (int i = 0; i < n; i++) {
            maxProfit = Math.max(maxProfit, maxRight[i] - prices[i]);
        }
        return maxProfit;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(N)\`

---

## 🚀 Approach 3: Optimised (Running Minimum — Single Pass)

### Intuition
- Maintain \`min_till_idx_i\` on the fly in a single pass.
- At each index \`i\`, update the running minimum and check the profit if sold today: \`prices[i] - min_till_idx_i\`.

### Code
\`\`\`java
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int maxDiff = -1;
        int min_till_idx_i = Integer.MAX_VALUE;

        for (int i = 0; i < n; i++) {
            min_till_idx_i = Math.min(min_till_idx_i, prices[i]);
            int diff = prices[i] - min_till_idx_i;
            if (diff > maxDiff)
                maxDiff = diff;
        }
        return (maxDiff == -1) ? 0 : maxDiff;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚠️ Edge Cases & Mistakes
- **Strictly decreasing prices (e.g. \`[7, 6, 4, 3, 1]\`):** No profitable transaction exists, so return \`0\` instead of a negative profit.
- **Similar Problems:**
  - Best Time to Buy and Sell Stock II *(Medium)*
  - Best Time to Buy and Sell Stock III *(Hard)*
  - Best Time to Buy and Sell Stock IV *(Hard)*
  - Best Time to Buy and Sell Stock with Cooldown *(Medium)*
`,

  'Week-01/Day-001_Arrays/Majority-Element': `# Majority Element

- **LeetCode Number:** 169
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Majority Element](https://leetcode.com/problems/majority-element/)
- **YouTube:** [Majority Element — Boyer-Moore Voting](https://www.youtube.com/watch?v=1r8kzrXJiUk)
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array \`nums\` of size \`n\`, return the **majority element** — the element that appears **more than \`⌊n / 2⌋\` times**. You may assume that the majority element always exists in the array.

### 📏 Constraints
- \`1 <= nums.length <= 5 * 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- Follow-up: Solve in \`O(N)\` time and \`O(1)\` space.

<details>
<summary><strong>💡 Hint</strong></summary>

If you pair up every occurrence of the majority element with a *different* element and cancel both out, the majority element is guaranteed to be the last one standing!

</details>

---

## 🧠 Intuition
- Keep one \`candidate\` and a \`count\`.
- If the next number equals \`candidate\`, \`count++\`. Otherwise \`count--\`, which cancels one vote of the candidate against one vote of a different number.
- If \`count\` hits \`0\`, the old candidate is fully cancelled out, so pick the current number as the new candidate.
- The majority element appears more than \`n / 2\` times, so the non-majority elements can't cancel all of its votes. It survives as the final candidate.

---

## 🐢 Approach 1: Brute Force (Nested Frequency Count)

### Intuition
- For each element, scan the entire array to count its occurrences.
- Return the first element whose frequency exceeds \`n / 2\`.

### Code
\`\`\`java
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
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N^2)\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚡ Approach 2: Better (HashMap & Sorting)

### Intuition
- **HashMap:** Track frequencies in one pass and return immediately once \`freq > nums.length / 2\`.
- **Sorting (Alternative):** Once sorted, any element appearing \`> n / 2\` times MUST occupy the middle index \`nums[n / 2]\`.

### Code
\`\`\`java
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
\`\`\`

\`\`\`java
import java.util.Arrays;

// Better Option B: Sorting — O(N log N) time, O(1) extra space
class SortingMethod {
    public int majorityElement(int[] nums) {
        Arrays.sort(nums);
        return nums[nums.length / 2];
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** HashMap \`O(N)\` · Sorting \`O(N log N)\`
- **Space Complexity (SC):** HashMap \`O(N)\` · Sorting \`O(1)\`

---

## 🚀 Approach 3: Optimised (Boyer-Moore Voting Algorithm)

### Intuition
- Track a running \`candidate\` and net vote balance \`count\`.
- Whenever \`count == 0\`, adopt the current element as the new candidate. Increment on match, decrement on mismatch.

### Code
\`\`\`java
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
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚠️ Edge Cases & Mistakes
- **Note:** Boyer-Moore without verification is correct *only* because LeetCode guarantees a majority element exists. If it is not guaranteed, add a second pass to verify that \`candidate\`'s count is strictly \`> n / 2\`.
`,

  'Week-01/Day-001_Arrays/Move-Zeroes': `# Move Zeroes

- **LeetCode Number:** 283
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Move Zeroes](https://leetcode.com/problems/move-zeroes/)
- **YouTube:** [Move Zeroes Explained](https://www.youtube.com/watch?v=AgiGd763srg)
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an integer array \`nums\`, move all \`0\`'s to the end of it while maintaining the **relative order** of the non-zero elements. You must do this **in-place** without making a copy of the array.

### 📏 Constraints
- \`1 <= nums.length <= 10^4\`
- \`-2^31 <= nums[i] <= 2^31 - 1\`

<details>
<summary><strong>💡 Hint</strong></summary>

Don't try to move zeroes rightward one-by-one. Instead, collect non-zero elements at the front using a slow write pointer \`count\`!

</details>

---

## 🧠 Intuition
- \`count\` marks the position where the next non-zero element should go. Everything before \`count\` is already non-zero and in original order.
- \`i\` scans the array. When \`nums[i]\` is non-zero, swap it with \`nums[count]\`, then \`count++\`.
- The swap pushes any zero sitting at \`count\` toward the right, behind the non-zero element.
- Zeroes are never moved on their own — they just get left behind as non-zero elements move forward.

---

## 🐢 Approach 1: Brute Force (Extra Array)

### Intuition
- Copy all non-zero elements into a temporary array in order, leaving remaining trailing slots as \`0\`, then copy back to \`nums\`.

### Code
\`\`\`java
class Solution {
    public void moveZeroes(int[] nums) {
        int n = nums.length;
        int[] temp = new int[n];
        int idx = 0;
        for (int x : nums) {
            if (x != 0) temp[idx++] = x;
        }
        for (int i = 0; i < n; i++) {
            nums[i] = temp[i];
        }
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(N)\` *(violates in-place constraint)*

---

## ⚡ Approach 2: Better (Two-Pass Overwrite + Zero Fill)

### Intuition
- Pass 1: Copy every non-zero element to \`nums[pos++]\`.
- Pass 2: Fill remaining indices from \`pos\` to \`n - 1\` with \`0\`.

### Code
\`\`\`java
class Solution {
    public void moveZeroes(int[] nums) {
        int pos = 0;
        for (int x : nums) {
            if (x != 0) nums[pos++] = x;
        }
        while (pos < nums.length) {
            nums[pos++] = 0;
        }
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(1)\`

---

## 🚀 Approach 3: Optimised (Single-Pass Two-Pointer Swap)

### Intuition
- Use \`count\` as the write index for the next non-zero element and \`i\` as the scanner.
- On every non-zero \`nums[i]\`, swap \`nums[count]\` and \`nums[i]\`, then increment \`count\`.

### Code
\`\`\`java
class Solution {
    public void swap(int j, int i, int[] nums) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
        return;
    }

    public void moveZeroes(int[] nums) {
        int n = nums.length;
        int count = 0;

        for (int i = 0; i < n; i++) {
            if (nums[i] != 0) {
                swap(count, i, nums);
                count++;
            }
        }
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\` *(single pass)*
- **Space Complexity (SC):** \`O(1)\` *(in-place)*

---

## ⚠️ Edge Cases & Mistakes
- **All zeroes or no zeroes:** Works cleanly without extra checks (self-swaps when \`i == count\`).
- **Preserving order:** Never swap a zero with the *last* element of the array — that breaks relative ordering of non-zero elements.
`,

  'Week-01/Day-001_Arrays/Squares-of-a-Sorted-Array': `# Squares of a Sorted Array

- **LeetCode Number:** 977
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an integer array \`nums\` sorted in **non-decreasing order**, return an array of the **squares of each number** sorted in non-decreasing order.

### 📏 Constraints
- \`1 <= nums.length <= 10^4\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`nums\` is sorted in non-decreasing order.
- Follow-up: Solve in \`O(N)\` time.

<details>
<summary><strong>💡 Hint</strong></summary>

Squaring negative numbers flips their order, so the **largest** square is always located at either the far left or far right end of the array!

</details>

---

## 🧠 Intuition
- The input is sorted, but squaring turns large negatives into large positives.
- So the largest square is always at one of the two ends, never in the middle.
- Compare \`nums[l]²\` and \`nums[r]²\`. The bigger one is the largest remaining square.
- Place it at the back of \`ans\` (index \`i\`), then move that pointer inward.
- Filling \`ans\` from right to left makes it come out sorted ascending.

---

## 🐢 Approach 1: Brute Force (Square & Sort)

### Intuition
- Square every element in-place, then run \`Arrays.sort(nums)\`.

### Code
\`\`\`java
import java.util.Arrays;

class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            nums[i] = nums[i] * nums[i];
        }
        Arrays.sort(nums);
        return nums;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N log N)\`
- **Space Complexity (SC):** \`O(1)\` *(ignoring sorting stack)*

---

## ⚡ Approach 2: Better (Two Pointers with \`Math.abs\`)

### Intuition
- Place \`start = 0\` and \`end = n - 1\`.
- Fill \`ans\` from \`n - 1\` down to \`0\` by comparing \`Math.abs(nums[start])\` vs \`Math.abs(nums[end])\`.

### Code
\`\`\`java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int start = 0;
        int end = n - 1;
        // Fill the answer array from END to START (reverse order)
        // This ensures larger squares go to the end first
        for (int i = n - 1; i >= 0; i--) {
            if (Math.abs(nums[start]) >= Math.abs(nums[end])) {
                ans[i] = nums[start] * nums[start];
                start++;
            } else {
                ans[i] = nums[end] * nums[end];
                end--;
            }
        }
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(N)\`

---

## 🚀 Approach 3: Optimised (Two Pointers — Direct Square Comparison)

### Intuition
- Avoid \`Math.abs\` overhead by directly comparing \`nums[l] * nums[l]\` and \`nums[r] * nums[r]\` and placing the larger square at \`ans[i]\` from right to left.

### Code
\`\`\`java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int l = 0, r = n - 1;

        for (int i = n - 1; i >= 0; i--) {
            int a = nums[l] * nums[l];
            int b = nums[r] * nums[r];
            if (a > b) {
                ans[i] = a;
                l++;
            } else {
                ans[i] = b;
                r--;
            }
        }
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(N)\` *(output array)*

---

## ⚠️ Edge Cases & Mistakes
- **All negative or all positive arrays:** Still handled seamlessly because one pointer simply walks through the entire array.
- **Filling from index 0 instead of \`n - 1\`:** We only know the *largest* remaining square at the two ends, not the smallest — so always fill \`ans\` backwards!
`,

  'Week-01/Day-001_Arrays/Merge-Sorted-Array': `# Merge Sorted Array

- **LeetCode Number:** 88
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 1)*
- **URL:** [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
You are given two sorted integer arrays \`nums1\` (length \`m + n\`, with \`m\` valid elements followed by \`n\` trailing zeroes) and \`nums2\` (length \`n\`). Merge \`nums2\` into \`nums1\` **in-place** as one sorted array.

### 📏 Constraints
- \`nums1.length == m + n\`, \`nums2.length == n\`
- \`0 <= m, n <= 200\`
- \`1 <= m + n <= 200\`

<details>
<summary><strong>💡 Hint</strong></summary>

The empty buffer slots sit at the **end** of \`nums1\`. Merge from **right to left** placing the largest element first so you never overwrite unread elements!

</details>

---

## 🧠 Intuition
- \`nums1\` has \`n\` empty slots at the end. If you fill from the front, you overwrite unread elements of \`nums1\`.
- Fill from the back instead. The largest remaining element goes at \`end\`.
- Compare \`nums1[i]\` and \`nums2[j]\`, place the bigger one at \`end\`, move that pointer and \`end\` left.
- The write position \`end\` is never behind \`i\`, so no unread element of \`nums1\` gets overwritten.
- Loop only while \`j >= 0\`. If \`nums2\` is exhausted, the rest of \`nums1\` is already in place.
- The \`i >= 0\` check handles \`nums1\` running out first, so the leftover \`nums2\` elements get copied in.

---

## 🐢 Approach 1: Brute Force (Copy & Sort)

### Intuition
- Copy all elements of \`nums2\` into the trailing empty slots of \`nums1\`, then call \`Arrays.sort(nums1)\`.

### Code
\`\`\`java
import java.util.Arrays;

class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        for (int i = 0; i < n; i++) {
            nums1[m + i] = nums2[i];
        }
        Arrays.sort(nums1);
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O((m + n) log(m + n))\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚡ Approach 2: Better (Extra Array — Merge Sort Style)

### Intuition
- Two pointers \`i\`, \`j\` walk \`nums1\` and \`nums2\`, always taking the smaller element into \`ans\`.
- When one array runs out, copy the rest of the other, then copy \`ans\` back into \`nums1\`.

### Code
\`\`\`java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int[] ans = new int[m + n];
        int i = 0, j = 0, idx = 0;
        while (i < m && j < n) {
            if (nums1[i] <= nums2[j]) {
                ans[idx] = nums1[i];
                i++;
            } else {
                ans[idx] = nums2[j];
                j++;
            }
            idx++;
        }

        if (i == m) {
            while (j < n) {
                ans[idx] = nums2[j];
                idx++;
                j++;
            }
        } else {
            while (i < m) {
                ans[idx] = nums1[i];
                idx++;
                i++;
            }
        }
        for (int p = 0; p < m + n; p++) {
            nums1[p] = ans[p];
        }
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(m + n)\`
- **Space Complexity (SC):** \`O(m + n)\`

---

## 🚀 Approach 3: Optimised (Three Pointers — Merge From the Back)

### Intuition
- Initialize \`i = m - 1\`, \`j = n - 1\`, \`end = m + n - 1\`.
- While \`j >= 0\`, place \`max(nums1[i], nums2[j])\` at \`nums1[end--]\`.

### Code
\`\`\`java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;
        int j = n - 1;
        int end = m + n - 1;

        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[end] = nums1[i];
                i--;
            } else {
                nums1[end] = nums2[j];
                j--;
            }
            end--;
        }
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(m + n)\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚠️ Edge Cases & Mistakes
- **\`m = 0\` (all elements come from \`nums2\`):** Handled by \`i >= 0\` guard inside the \`while (j >= 0)\` loop.
- **\`n = 0\` (\`nums2\` is empty):** Loop never runs; \`nums1\` stays untouched.
`,

  'Week-01/Day-002_Arrays/Remove-Duplicates-from-Sorted-Array': `# Remove Duplicates from Sorted Array

- **LeetCode Number:** 26
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given a sorted integer array \`nums\`, remove duplicates **in-place** such that each unique element appears only once and relative order is kept. Return \`k\`, the number of unique elements, with the first \`k\` slots of \`nums\` holding the unique values.

### 📏 Constraints
- \`1 <= nums.length <= 3 * 10^4\`
- \`-100 <= nums[i] <= 100\`
- \`nums\` is sorted in non-decreasing order.

<details>
<summary><strong>💡 Hint</strong></summary>

Because the array is **sorted**, all duplicates are adjacent! Compare the scanner \`arr[j]\` against the last written unique element \`arr[i - 1]\`.

</details>

---

## 🧠 Intuition
- Since \`nums\` is sorted, identical elements are always grouped side-by-side.
- Maintain a slow write pointer \`i\` marking the next slot for a unique element, and a fast pointer \`j\` scanning forward.
- Whenever \`arr[j] != arr[i - 1]\`, we found a new unique value — write it at \`arr[i]\` and advance \`i\`.

---

## 🐢 Approach 1: Brute Force (PriorityQueue Deduplication)

### Intuition
- Insert elements into a Min-Heap (\`PriorityQueue\`) only if \`!pq.contains(ele)\`, then poll them back into \`nums\`.
- Note: \`pq.contains(ele)\` takes \`O(N)\` per element.

### Code
\`\`\`java
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
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N^2)\` *(due to \`pq.contains\`)*
- **Space Complexity (SC):** \`O(N)\`

---

## ⚡ Approach 2: Better (LinkedHashSet)

### Intuition
- Insert all numbers into a \`LinkedHashSet\` (which preserves insertion order and removes duplicates in \`O(1)\` avg), then write back into \`nums\`.

### Code
\`\`\`java
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
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(N)\`

---

## 🚀 Approach 3: Optimised (In-Place Two Pointers)

### Intuition
- \`arr[0]\` is always unique, so start write pointer \`i = 1\`.
- Scan \`j\` from \`1\` to \`n - 1\`. If \`arr[j] != arr[i - 1]\`, assign \`arr[i] = arr[j]\` and increment \`i\`.
- Return \`i\` (total unique count).

### Code
\`\`\`java
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
\`\`\`

<details>
<summary><strong>Alternative Style (using <code>curr = 0</code>)</strong></summary>

\`\`\`java
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
\`\`\`

</details>

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚠️ Edge Cases & Mistakes
- **Return value:** Return \`i\` (the *count* of unique elements), not the last index \`i - 1\`.
- **Single-element array:** \`i = 1\`, loop doesn't execute, returns \`1\` correctly.
`,

  'Week-01/Day-002_Arrays/Remove-Duplicates-from-Sorted-Array-II': `# Remove Duplicates from Sorted Array II

- **LeetCode Number:** 80
- **Difficulty:** Medium
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given a sorted integer array \`nums\`, remove some duplicates **in-place** such that each unique element appears **at most twice**. Maintain relative order and return the new length \`k\`.

### 📏 Constraints
- \`1 <= nums.length <= 3 * 10^4\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`nums\` is sorted in non-decreasing order.

<details>
<summary><strong>💡 Hint</strong></summary>

Compare the incoming element \`ele\` with \`nums[i - 2]\` (the element 2 positions before the write pointer). Because the array is sorted, if \`ele != nums[i - 2]\`, then \`ele\` has appeared at most once so far in the valid prefix!

</details>

---

## 🧠 Intuition
- Generalize Remove Duplicates I (which allowed at most \`k = 1\` copy by checking \`ele != nums[i - 1]\`):
- For **at most \`k = 2\` copies**, always accept the first 2 elements (\`i < 2\`), and thereafter accept \`ele\` only if \`ele != nums[i - 2]\`.
- This exact pattern works for any allowed frequency \`k\`: \`if (i < k || ele != nums[i - k])\`.

---

## 🐢 Approach 1: Brute Force (Frequency Map + Rewrite)

### Intuition
- Use a \`LinkedHashMap<Integer, Integer>\` to count occurrences, capping each value at 2, and write the kept elements back into \`nums\`.

### Code
\`\`\`java
import java.util.LinkedHashMap;
import java.util.Map;

class Solution {
    public int removeDuplicates(int[] nums) {
        Map<Integer, Integer> freq = new LinkedHashMap<>();
        for (int x : nums) {
            freq.put(x, Math.min(2, freq.getOrDefault(x, 0) + 1));
        }
        int i = 0;
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            for (int c = 0; c < e.getValue(); c++) {
                nums[i++] = e.getKey();
            }
        }
        return i;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(N)\` *(violates \`O(1)\` in-place constraint)*

---

## ⚡ Approach 2: Better (Two Pointers + Explicit Streak Counter)

### Intuition
- Track how many times the current value has repeated in a \`count\` variable. Reset \`count = 1\` on a new value, and write whenever \`count <= 2\`.

### Code
\`\`\`java
class Solution {
    public int removeDuplicates(int[] nums) {
        int write = 1, count = 1;
        for (int read = 1; read < nums.length; read++) {
            if (nums[read] == nums[read - 1]) {
                count++;
            } else {
                count = 1;
            }
            if (count <= 2) {
                nums[write++] = nums[read];
            }
        }
        return write;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(1)\`

---

## 🚀 Approach 3: Optimised (Generalized \`i - 2\` Window Check)

### Intuition
- Keep write pointer \`i = 0\`.
- For every \`ele\` in \`nums\`: if \`i < 2 || ele != nums[i - 2]\`, write \`nums[i++] = ele\`.
- Clean, 5 lines, zero extra counter variables.

### Code
\`\`\`java
class Solution {
    public int removeDuplicates(int[] nums) {
        int i = 0;
        for (int ele : nums) {
            if (i < 2 || ele != nums[i - 2]) {
                nums[i] = ele;
                i++;
            }
        }
        return i;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚠️ Edge Cases & Mistakes
- **Comparing with \`nums[read - 2]\` instead of \`nums[i - 2]\`:** Always compare against the **written prefix** \`nums[i - 2]\` because earlier elements at \`read - 2\` may have already been overwritten!
`,

  'Week-01/Day-002_Arrays/Find-All-Numbers-Disappeared-in-an-Array': `# Find All Numbers Disappeared in an Array

- **LeetCode Number:** 448
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)
- **YouTube:** [Find All Disappeared Numbers Explained](https://www.youtube.com/watch?v=i3Ew9X4zH5I)
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array \`nums\` of \`n\` integers where \`nums[i]\` is in the range \`[1, n]\`, return an array of all the integers in the range \`[1, n]\` that **do not appear** in \`nums\`.

### 📏 Constraints
- \`n == nums.length\`
- \`1 <= n <= 10^5\`
- \`1 <= nums[i] <= n\`
- Follow-up: Do it in \`O(N)\` time without extra space (output list doesn't count).

<details>
<summary><strong>💡 Hint</strong></summary>

Every number \`v\` in \`[1..n]\` has a natural "home index" \`v - 1\`. You can either **negate** the value at index \`v - 1\` as a visited marker, or **Cyclic Sort** each number into its home index!

</details>

---

## 🧠 Intuition
**Idea:** The array has values from \`1\` to \`n\`, and it also has \`n\` slots (indices \`0\` to \`n - 1\`). So every number has a "home" slot: number \`v\` lives at index \`v - 1\`.

Instead of using a separate array to remember *"which numbers did I see?"*, use the **sign of each element as a sticky note**:
- **Negative** at index \`i\` → number \`i + 1\` **was seen**
- **Positive** at index \`i\` → number \`i + 1\` **never appeared**

### Example: \`[4, 3, 2, 7, 8, 2, 3, 1]\`

| Number seen | Slot marked negative |
|---|---|
| 4 | index 3 |
| 3 | index 2 |
| 2 | index 1 |
| 7 | index 6 |
| 8 | index 7 |
| 2 (dup) | index 1 (already negative, skip) |
| 3 (dup) | index 2 (already negative, skip) |
| 1 | index 0 |

Indices \`4\` and \`5\` stay positive, so the missing numbers are **5** and **6**.

---

## 🐢 Approach 1: Brute Force (Auxiliary Count Array)

### Intuition
- Allocate a \`count[]\` array of size \`n\`.
- Mark \`count[nums[i] - 1] = 1\` for each seen number.
- Collect all \`j + 1\` where \`count[j] == 0\`.

### Code
\`\`\`java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int[] count = new int[nums.length];
        ArrayList<Integer> ans = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            int index = nums[i] - 1;
            count[index] = sum + 1;
        }

        for (int j = 0; j < nums.length; j++) {
            if (count[j] == 0) {
                ans.add(j + 1);
            }
        }
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(N)\`

---

## ⚡ Approach 2: Better (In-Place Sign Flipping / Sticky-Note Marking)

### Intuition
- **Pass 1 (Mark):** For each element, read \`idx = Math.abs(nums[i]) - 1\`. Flip \`nums[idx]\` to negative (only if \`nums[idx] > 0\` so duplicates don't flip it back!).
- **Pass 2 (Collect):** Any index \`i\` with \`nums[i] > 0\` means \`i + 1\` never appeared.
- **Why \`abs\`?** \`nums[i]\` may have been negated as a mark, but its original value is still its magnitude.

### Code
\`\`\`java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            int idx = Math.abs(nums[i]) - 1; // 0 based

            if (nums[idx] > 0) {
                nums[idx] = -nums[idx];
            }
        }

        List<Integer> ans = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            if (nums[i] > 0) {
                ans.add(i + 1);
            }
        }

        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\` *(two passes)*
- **Space Complexity (SC):** \`O(1)\` extra *(output list doesn't count)*

---

## 🚀 Approach 3: Optimised (Cyclic Sort)

### Intuition
- Place every number \`nums[i]\` into its correct home index \`correctidx = nums[i] - 1\` via swapping.
- Check \`nums[i] != nums[correctidx]\` — this automatically handles duplicates (stops infinite loops!).
- After sorting, any index \`j\` where \`nums[j] != j + 1\` reveals missing number \`j + 1\`.

### Code
\`\`\`java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int i = 0;
        ArrayList<Integer> ans = new ArrayList<>();

        while (i < nums.length) {
            int correctidx = nums[i] - 1;
            if (nums[i] != nums[correctidx]) { // automatically takes care of duplicates
                swap(nums, i, correctidx);
            } else {
                i++;
            }
        }
        for (int j = 0; j < nums.length; j++) {
            if (nums[j] != j + 1)
                ans.add(j + 1);
        }
        return ans;
    }

    void swap(int[] nums, int i, int correctidx) {
        int temp = nums[i];
        nums[i] = nums[correctidx];
        nums[correctidx] = temp;
    }
}
\`\`\`

<details>
<summary><strong>Dry Run Trace on <code>[4,3,2,7,8,2,3,1]</code></strong></summary>

\`\`\`text
Index:  0 1 2 3 4 5 6 7
Start: [4,3,2,7,8,2,3,1]
swap(0,3) -> [7,3,2,4,8,2,3,1]
swap(0,6) -> [3,3,2,4,8,2,7,1]
swap(0,2) -> [2,3,3,4,8,2,7,1]
swap(0,1) -> [3,2,3,4,8,2,7,1]
...indices 4 and 5 end up without 5 and 6!
\`\`\`

</details>

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(1)\` extra

---

## ⚠️ Edge Cases & Mistakes
- **Catch:** Both in-place methods mutate the input array.
- **Double-flipping in sign-marking:** Always guard with \`if (nums[idx] > 0)\` (or use \`nums[idx] = -Math.abs(nums[idx])\`) so duplicate elements don't flip a negative mark back to positive.
`,

  'Week-01/Day-002_Arrays/Intersection-of-Two-Arrays': `# Intersection of Two Arrays

- **LeetCode Number:** 349
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given two integer arrays \`nums1\` and \`nums2\`, return an array of their **intersection**. Each element in the result must be **unique** and you may return the result in any order.

### 📏 Constraints
- \`1 <= nums1.length, nums2.length <= 1000\`
- \`0 <= nums1[i], nums2[i] <= 1000\`

<details>
<summary><strong>💡 Hint</strong></summary>

Put all elements of \`nums1\` into a \`HashSet\`. When iterating \`nums2\`, use \`set1.remove(x)\` — it checks membership AND prevents duplicate insertions in one \`O(1)\` call!

</details>

---

## 🧠 Intuition
- **Core problem:** Brute force is slow because for every element in \`nums1\`, you re-scan all of \`nums2\` just to answer: *"does this value exist?"*
- **Fix:** A \`HashSet\` acts like a **guest list at a door** answering *"does X exist?"* in \`O(1)\` average time.
- **Why \`remove(x)\` instead of \`contains(x)\`?**
  - The result must be unique, but \`nums2\` can have duplicates (e.g. \`[9, 9]\`).
  - With \`remove(x)\`, the first \`9\` is removed and returns \`true\` (add it). The second \`9\` returns \`false\` (skip). One call does two jobs!

---

## 🐢 Approach 1: Brute Force (Nested Loops)

### Intuition
- For each \`a\` in \`nums1\`, loop through \`nums2\`.
- If \`a == b\` and \`a\` isn't already in \`res\`, add it and break.

### Code
\`\`\`java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        List<Integer> res = new ArrayList<>();
        for (int a : nums1) {
            for (int b : nums2) {
                if (a == b && !res.contains(a)) {
                    res.add(a);
                    break;
                }
            }
        }
        int[] ans = new int[res.size()];
        for (int i = 0; i < ans.length; i++)
            ans[i] = res.get(i);
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(n * m)\` *(plus \`res.contains\` scan)*
- **Space Complexity (SC):** \`O(1)\` extra *(apart from output)*

---

## ⚡ Approach 2: Better (Sort + Two Pointers)

### Intuition
- If both arrays are sorted, equal elements line up.
- Walk two pointers \`i = 0, j = 0\`:
  - \`nums1[i] < nums2[j]\` → \`i++\`
  - \`nums1[i] > nums2[j]\` → \`j++\`
  - Equal → add only if different from last added value, then \`i++, j++\`.

### Code
\`\`\`java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        List<Integer> res = new ArrayList<>();
        int i = 0, j = 0;
        while (i < nums1.length && j < nums2.length) {
            if (nums1[i] < nums2[j])
                i++;
            else if (nums1[i] > nums2[j])
                j++;
            else {
                if (res.isEmpty() || res.get(res.size() - 1) != nums1[i]) {
                    res.add(nums1[i]);
                }
                i++;
                j++;
            }
        }
        int[] ans = new int[res.size()];
        for (int k = 0; k < ans.length; k++)
            ans[k] = res.get(k);
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(n log n + m log m)\`
- **Space Complexity (SC):** \`O(1)\` extra *(apart from sorting & output)*

---

## 🚀 Approach 3: Optimised (HashSet with \`remove(x)\`)

### Intuition
1. Put every element of \`nums1\` into \`set1\`.
2. Loop through \`nums2\`: if \`set1.remove(x)\` returns \`true\`, add \`x\` to \`res\`.
3. Convert \`res\` to \`int[]\` and return.

### Code
\`\`\`java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set1 = new HashSet<>();
        for (int x : nums1)
            set1.add(x);

        List<Integer> res = new ArrayList<>();
        for (int x : nums2) {
            if (set1.remove(x)) { // true only if it was present
                res.add(x);
            }
        }

        int[] ans = new int[res.size()];
        for (int i = 0; i < ans.length; i++)
            ans[i] = res.get(i);
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(n + m)\`
- **Space Complexity (SC):** \`O(n)\`

---

## ⚠️ Edge Cases & Mistakes
- **Duplicates in \`nums2\`:** Using \`set1.contains(x)\` without removing causes duplicates in the result. Always use \`set1.remove(x)\` or a second result set.
`,

  'Week-01/Day-002_Arrays/Intersection-of-Two-Arrays-II': `# Intersection of Two Arrays II

- **LeetCode Number:** 350
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given two integer arrays \`nums1\` and \`nums2\`, return an array of their intersection. Each element in the result must appear **as many times as it shows in both arrays**, in any order.

### 📏 Constraints
- \`1 <= nums1.length, nums2.length <= 1000\`
- \`0 <= nums1[i], nums2[i] <= 1000\`

<details>
<summary><strong>💡 Hint</strong></summary>

Unlike LC 349 (unique intersection), here **frequencies matter**! Replace the \`HashSet\` with a \`HashMap<Integer, Integer>\` storing counts, and decrement the count on each match.

</details>

---

## 🧠 Intuition
- Count the frequency of every number in \`nums1\` using a \`HashMap\`.
- Walk through \`nums2\`: if a number \`x\` still has remaining count \`> 0\`, add \`x\` to the result and decrement its available count by \`1\`.

---

## 🐢 Approach 1: Brute Force (Nested Scan + Visited Array)

### Intuition
- For each element in \`nums1\`, scan \`nums2\` for an unmatched equal element and mark that index in \`nums2\` as used.

### Code
\`\`\`java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        boolean[] used = new boolean[nums2.length];
        List<Integer> res = new ArrayList<>();
        for (int a : nums1) {
            for (int j = 0; j < nums2.length; j++) {
                if (!used[j] && a == nums2[j]) {
                    res.add(a);
                    used[j] = true;
                    break;
                }
            }
        }
        int[] ans = new int[res.size()];
        for (int i = 0; i < ans.length; i++) ans[i] = res.get(i);
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(n * m)\`
- **Space Complexity (SC):** \`O(m)\`

---

## ⚡ Approach 2: Better (Sort + Two Pointers)

### Intuition
- Sort both arrays and advance two pointers \`i\`, \`j\`. Whenever \`nums1[i] == nums2[j]\`, add it (including duplicates!) and advance both pointers.
- Great follow-up answer when the input arrays are **already sorted** or \`nums2\` is too big to fit in memory!

### Code
\`\`\`java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        List<Integer> res = new ArrayList<>();
        int i = 0, j = 0;
        while (i < nums1.length && j < nums2.length) {
            if (nums1[i] < nums2[j]) i++;
            else if (nums1[i] > nums2[j]) j++;
            else {
                res.add(nums1[i]);
                i++;
                j++;
            }
        }
        int[] ans = new int[res.size()];
        for (int k = 0; k < ans.length; k++) ans[k] = res.get(k);
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(n log n + m log m)\`
- **Space Complexity (SC):** \`O(1)\` extra *(apart from sorting & output)*

---

## 🚀 Approach 3: Optimised (HashMap Frequency Counter)

### Intuition
- Build a frequency map from \`nums1\` (tip: build it on the *smaller* array to minimize memory).
- For every \`x\` in \`nums2\`, if \`freq.getOrDefault(x, 0) > 0\`, append \`x\` to result and decrement its count.

### Code
\`\`\`java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums1)
            freq.put(x, freq.getOrDefault(x, 0) + 1);

        List<Integer> res = new ArrayList<>();
        for (int x : nums2) {
            int c = freq.getOrDefault(x, 0);
            if (c > 0) {
                res.add(x);
                freq.put(x, c - 1);
            }
        }

        int[] ans = new int[res.size()];
        for (int i = 0; i < ans.length; i++)
            ans[i] = res.get(i);
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(n + m)\`
- **Space Complexity (SC):** \`O(min(n, m))\`

---

## ⚠️ Edge Cases & Mistakes
- **Follow-up questions in interviews:**
  - *What if arrays are already sorted?* → Use Two Pointers (\`O(n + m)\` time, \`O(1)\` space).
  - *What if \`nums1\` is much smaller than \`nums2\`?* → Hash \`nums1\`, stream \`nums2\`.
`,

  'Week-01/Day-002_Arrays/Maximum-Population-Year': `# Maximum Population Year

- **LeetCode Number:** 1854
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Maximum Population Year](https://leetcode.com/problems/maximum-population-year/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given \`logs[i] = [birth, death]\`, a person counts as alive in years \`birth <= x < death\` (**death year is excluded**). Return the **earliest year** with the maximum population.

### 📏 Constraints
- \`1 <= logs.length <= 100\`
- \`1950 <= birth_i < death_i <= 2050\`

<details>
<summary><strong>💡 Hint</strong></summary>

Each person only changes the population at **two points**: \`+1\` at \`birth\` and \`-1\` at \`death\`. Use a **Difference Array** (or Sweep Line / sorted births & deaths)!

</details>

---

## 🧠 Intuition
- Instead of checking every person for every year, notice that population only changes at **birth** (\`+1\`) and **death** (\`-1\`).
- **Difference Array (Bounded Years \`[1950, 2050]\`):** Mark \`delta[birth]++\` and \`delta[death]--\`, then take a prefix sum sweep over all years.
- **Sort Births & Deaths (Unbounded Years):** Sort \`births[]\` and \`deaths[]\` separately and use two pointers — works even if years are up to \`10^9\`!

---

## 🐢 Approach 1: Brute Force (Per Year, Per Log)

### Intuition
- For every year from \`1950\` to \`2050\`, loop over all logs and count how many satisfy \`birth <= year < death\`.
- Update \`ans\` only on **strictly greater** (\`>\`), so the earliest year wins ties.
- Weakness: Breaks down if the year range or log count grows large.

### Code
\`\`\`java
class Solution {
    public int maximumPopulation(int[][] logs) {
        int maxCount = 0, ans = 1950;
        for (int year = 1950; year <= 2050; year++) {
            int count = 0;
            for (int[] log : logs) {
                if (log[0] <= year && year < log[1]) count++;
            }
            if (count > maxCount) {
                maxCount = count;
                ans = year;
            }
        }
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(Y * N)\` *(where \`Y = 101\` years, \`N = logs.length\`)*
- **Space Complexity (SC):** \`O(1)\`

---

## ⚡ Approach 2: Better (Difference Array / Prefix Sum)

### Intuition
- Each log only changes population at two points: \`+1\` at \`birth\`, \`-1\` at \`death\`. No need to touch every year in between.
- Sweep years \`1950..2050\` in order maintaining running sum \`curr\`, updating \`ans\` only on strictly greater \`curr > maxCount\`.
- **Why \`-1\` at \`death\` and not \`death + 1\`?** The person is NOT alive in their death year, so they drop out exactly there.

### Code
\`\`\`java
class Solution {
    public int maximumPopulation(int[][] logs) {
        int[] delta = new int[2052];
        for (int[] log : logs) {
            delta[log[0]]++;
            delta[log[1]]--;
        }
        int curr = 0, maxCount = 0, ans = 1950;
        for (int year = 1950; year <= 2050; year++) {
            curr += delta[year];
            if (curr > maxCount) {
                maxCount = curr;
                ans = year;
            }
        }
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N + Y)\`
- **Space Complexity (SC):** \`O(Y)\`

---

## 🚀 Approach 3: Optimised (Sort Births & Deaths — Two Pointers / Sweep Line)

### Intuition
- Useful even if the year range is huge or unbounded, since it does **not** depend on \`Y\`.
- Extract \`births[]\` and \`deaths[]\` and sort both.
- Walk through \`births\` in ascending order: advance pointer \`d\` for all \`deaths[d] <= births[i]\` (people already gone).
- Alive population at \`births[i]\` is \`(i + 1) - d\`. Since the max must occur at some birth year, only check birth years.

### Code
\`\`\`java
import java.util.Arrays;

class Solution {
    public int maximumPopulation(int[][] logs) {
        int n = logs.length;
        int[] births = new int[n], deaths = new int[n];
        for (int i = 0; i < n; i++) {
            births[i] = logs[i][0];
            deaths[i] = logs[i][1];
        }
        Arrays.sort(births);
        Arrays.sort(deaths);

        int d = 0, maxCount = 0, ans = births[0];
        for (int i = 0; i < n; i++) {
            while (deaths[d] <= births[i])
                d++;
            int alive = (i + 1) - d;
            if (alive > maxCount) {
                maxCount = alive;
                ans = births[i];
            }
        }
        return ans;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N log N)\`
- **Space Complexity (SC):** \`O(N)\`

---

## ⚠️ Edge Cases & Mistakes
- **Tie-breaking:** Always use strict \`>\` (\`alive > maxCount\`) while sweeping years in ascending order so the **earliest** year is preserved.
- **Death year exclusion:** In Approach 3, use \`deaths[d] <= births[i]\` (inclusive) because someone dying in year \`X\` is already NOT alive in year \`X\`.
`,

  'Week-01/Day-002_Arrays/Find-Pivot-Index': `# Find Pivot Index

- **LeetCode Number:** 724
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 2)*
- **URL:** [Find Pivot Index](https://leetcode.com/problems/find-pivot-index/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Solved

---

## 📋 Question
Given an array of integers \`nums\`, calculate the **pivot index** — the leftmost index where the sum of all numbers strictly to the **left** equals the sum of all numbers strictly to the **right**. Return \`-1\` if no such index exists.

### 📏 Constraints
- \`1 <= nums.length <= 10^4\`
- \`-1000 <= nums[i] <= 1000\`

<details>
<summary><strong>💡 Hint</strong></summary>

Total sum satisfies \`totalSum = leftSum + nums[i] + rightSum\`, so \`rightSum = totalSum - leftSum - nums[i]\` — you don't need any extra arrays!

</details>

---

## 🧠 Intuition
- At any index \`i\`, the array splits into three parts: \`left\`, \`nums[i]\`, and \`right\`.
- Since \`sum = left + nums[i] + right\`, once we compute \`sum\` in one pass, we can find \`right = sum - left - nums[i]\` in \`O(1)\` at every index while maintaining \`left\` incrementally!

---

## 🐢 Approach 1: Brute Force (Recompute Left & Right Sums)

### Intuition
- For every candidate index \`i\`, loop left (\`0..i-1\`) to compute \`leftSum\` and loop right (\`i+1..n-1\`) to compute \`rightSum\`.

### Code
\`\`\`java
class Solution {
    public int pivotIndex(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            int left = 0, right = 0;
            for (int l = 0; l < i; l++) left += nums[l];
            for (int r = i + 1; r < n; r++) right += nums[r];
            if (left == right) return i;
        }
        return -1;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N^2)\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚡ Approach 2: Better (Prefix & Suffix Sum Arrays)

### Intuition
- Precompute \`prefix[i]\` = sum strictly before \`i\`, and \`suffix[i]\` = sum strictly after \`i\`.
- Return the first index \`i\` where \`prefix[i] == suffix[i]\`.

### Code
\`\`\`java
class Solution {
    public int pivotIndex(int[] nums) {
        int n = nums.length;

        int[] prefix = new int[n];
        int[] suffix = new int[n];

        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] + nums[i - 1];
        }

        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] + nums[i + 1];
        }

        for (int i = 0; i < n; i++) {
            if (suffix[i] == prefix[i])
                return i;
        }

        return -1;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(N)\`

---

## 🚀 Approach 3: Optimised (Total Sum + Running Left Sum)

### Intuition
- \`sum = left + nums[i] + right\` ⇒ \`right = sum - left - nums[i]\`.
- Compute total \`sum\` once, then sweep \`i = 0..n-1\`: check \`left == right\`, and only *after* checking, add \`nums[i]\` to \`left\`.

### Code
\`\`\`java
class Solution {
    public int pivotIndex(int[] nums) {
        // TC: O(n), SC: O(1)
        // sum = left + nums[i] + right
        // right = sum - left - nums[i]
        int n = nums.length;

        int sum = 0;
        for (int num : nums) {
            sum += num;
        }

        int left = 0;

        for (int i = 0; i < n; i++) {
            int right = sum - left - nums[i];
            if (left == right)
                return i;

            left += nums[i];
        }

        return -1;
    }
}
\`\`\`

### Complexity
- **Time Complexity (TC):** \`O(N)\`
- **Space Complexity (SC):** \`O(1)\`

---

## ⚠️ Edge Cases & Mistakes
- **Pivot at index \`0\` or \`n - 1\`:** Left sum at index \`0\` is \`0\`, right sum at index \`n - 1\` is \`0\`. Handled automatically by initializing \`left = 0\` and checking *before* \`left += nums[i]\`.
- **Negative numbers:** Because values can be negative, never assume prefix sums are monotonic (so don't try two pointers from ends).
`
};

function main() {
  const roadmap = loadRoadmap();
  let solvedConverted = 0;
  let templateUpdated = 0;
  let javaRemoved = 0;
  let skippedCustom = 0;

  for (const dayEntry of roadmap) {
    if (dayEntry.type !== 'dsa') continue;
    const weekFolder = formatWeekFolder(dayEntry.week);
    const dayFolder = formatDayFolder(dayEntry);
    const dayRelPath = `${weekFolder}/${dayFolder}`;
    const dayAbsPath = path.join(ROOT_DIR, weekFolder, dayFolder);

    const usedSlugs = new Set();
    for (const q of dayEntry.questions || []) {
      let qFolder = sanitizeSegment(q.name, 72);
      if (usedSlugs.has(qFolder.toLowerCase())) {
        let idx = 2;
        while (usedSlugs.has(`${qFolder}-${idx}`.toLowerCase())) idx++;
        qFolder = `${qFolder}-${idx}`;
      }
      usedSlugs.add(qFolder.toLowerCase());

      const qRelPath = `${dayRelPath}/${qFolder}`;
      const qAbsPath = path.join(dayAbsPath, qFolder);
      if (!fs.existsSync(qAbsPath)) continue;

      const mdPath = path.join(qAbsPath, 'understanding.md');

      if (SOLVED_MD_BY_RELPATH[qRelPath]) {
        // 1. Write rich hand-crafted markdown for solved question
        fs.writeFileSync(mdPath, SOLVED_MD_BY_RELPATH[qRelPath], 'utf8');
        solvedConverted++;

        // Remove redundant .java files from this solved folder
        for (const f of fs.readdirSync(qAbsPath)) {
          if (/\.java$/i.test(f)) {
            fs.unlinkSync(path.join(qAbsPath, f));
            javaRemoved++;
          }
        }
      } else {
        // 2. For unsolved questions: remove untouched starter .java files & upgrade starter understanding.md
        let hasCustomJava = false;
        const javaFiles = fs.readdirSync(qAbsPath).filter((f) => /\.java$/i.test(f));
        for (const jf of javaFiles) {
          const jPath = path.join(qAbsPath, jf);
          const tier = jf.toLowerCase().replace(/\.java$/, '');
          if (tier === 'bruteforce' || tier === 'better' || tier === 'optimised') {
            const actual = fs.readFileSync(jPath, 'utf8');
            const expected = buildOldJavaTemplate(dayEntry, q, tier);
            if (normalizeText(actual) === normalizeText(expected)) {
              fs.unlinkSync(jPath);
              javaRemoved++;
            } else {
              hasCustomJava = true;
            }
          } else {
            hasCustomJava = true;
          }
        }

        if (!hasCustomJava) {
          fs.writeFileSync(mdPath, buildNewDsaTemplate(dayEntry, q), 'utf8');
          templateUpdated++;
        } else {
          skippedCustom++;
        }
      }
    }
  }

  console.log('Migration complete:', {
    solvedConverted,
    templateUpdated,
    javaRemoved,
    skippedCustom
  });
}

main();
