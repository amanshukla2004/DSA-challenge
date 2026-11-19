# Java Strings for DSA: Everything You Actually Use

## 1. How Strings work in Java

- Strings are **immutable**. Every change creates a new object.
- Literals live in the **string pool**, so `"a" == "a"` is `true`, but `new String("a") == "a"` is `false`.
- `==` compares references. `.equals()` compares content. **Always use `.equals()`.**

```java
String a = "hello";
String b = "hello";
String c = new String("hello");

System.out.println(a == b);       // true  (same pool object)
System.out.println(a == c);       // false (different object)
System.out.println(a.equals(c));  // true
```

---

## 2. Methods you use in 90% of problems

| Method | What it does | Time |
|---|---|---|
| `s.length()` | Length (method, not field. Arrays use `.length`) | O(1) |
| `s.charAt(i)` | Char at index i | O(1) |
| `s.substring(i, j)` | Chars from i to j-1 (j is exclusive) | O(k) |
| `s.indexOf(x)` / `lastIndexOf(x)` | First / last position, -1 if absent | O(n·m) |
| `s.contains(x)` | Substring check | O(n·m) |
| `s.startsWith(x)` / `endsWith(x)` | Prefix / suffix check | O(m) |
| `s.equals(t)` / `equalsIgnoreCase(t)` | Content comparison | O(n) |
| `s.compareTo(t)` | Lexicographic. Returns 0, negative or positive | O(n) |
| `s.toCharArray()` | Convert to `char[]` for in-place edits | O(n) |
| `s.split(regex)` | Split into `String[]` | O(n) |
| `s.trim()` / `strip()` | Remove edge whitespace | O(n) |
| `s.isEmpty()` / `isBlank()` | Empty check (`isBlank` is Java 11+) | O(1) |
| `s.replace(a, b)` | Replace all occurrences | O(n) |
| `String.valueOf(x)` | Anything to String | - |
| `String.join(",", list)` | Join with delimiter | O(n) |
| `"ab".repeat(3)` | `"ababab"` (Java 11+) | O(n·k) |
| `toString()` | | |
| `valueOf()`|||

---

## 3. StringBuilder

Use it whenever you build or modify a string in a loop.

```java
StringBuilder sb = new StringBuilder();
sb.append("abc");           // add at end
sb.append('d');
sb.insert(0, "x");          // O(n)
sb.deleteCharAt(sb.length() - 1);  // O(1) at the end
sb.setCharAt(0, 'z');
sb.reverse();
sb.setLength(sb.length() - 1);     // trim last char
String res = sb.toString();
```

**Why it matters:**

```java
// Brute force: O(n^2), creates a new String every iteration
String s = "";
for (int i = 0; i < n; i++) s += "a";

// Optimized: O(n) total
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append("a");
```

- `StringBuilder`: not thread-safe, fast. Use this in DSA.
- `StringBuffer`: thread-safe, slower. Almost never needed.

---

## 4. Character tricks

```java
char c = 'g';

Character.isDigit(c);
Character.isLetter(c);
Character.isLetterOrDigit(c);
Character.isUpperCase(c);
Character.isLowerCase(c);
Character.toUpperCase(c);
Character.toLowerCase(c);

int digit = '7' - '0';              // 7
int idx   = c - 'a';                // 6  (alphabet index 0-25)
char back = (char) (idx + 'a');     // 'g'
```

Remember that `char + int` becomes `int`, so cast back to `char`.

---

## 5. Conversions

```java
int n = Integer.parseInt("123");
String s = String.valueOf(123);
int bin = Integer.parseInt("1010", 2);
String b = Integer.toBinaryString(10);

// Sort characters of a string
char[] arr = s.toCharArray();
Arrays.sort(arr);
String sorted = new String(arr);   // or String.valueOf(arr)

// String to List<Character>
List<Character> list = s.chars().mapToObj(x -> (char) x).toList();
```

---

## 6. Frequency array vs HashMap

For lowercase letters, an `int[26]` is faster and simpler than a `HashMap`.

```java
int[] freq = new int[26];
for (char c : s.toCharArray()) freq[c - 'a']++;
```

| Charset | Array size |
|---|---|
| Lowercase a-z | `int[26]` |
| Upper + lower | `int[52]` or `int[128]` |
| Any ASCII | `int[128]` / `int[256]` |
| Unicode / unknown | `HashMap<Character, Integer>` |

---

## 7. Data structures paired with Strings

- `int[26]` / `int[128]`: frequency counting
- `HashMap<Character, Integer>`: frequency, last-seen index
- `HashSet<Character>`: uniqueness, window checks
- `Stack<Character>` / `Deque`: parentheses, decode string, remove duplicates
- `PriorityQueue`: reorganize string, top-K frequent
- `Trie`: prefix search, word dictionary
- `TreeMap`: sorted frequency

---

## 8. Patterns, each with a problem

### 8.1 Two pointers: Valid Palindrome

```java
boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r)))
            return false;
        l++; r--;
    }
    return true;
}
```

- Brute force: build a cleaned reversed copy and compare. O(n) time, O(n) space.
- Optimized: two pointers. O(n) time, O(1) space.

### 8.2 Frequency count: Valid Anagram

```java
boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] f = new int[26];
    for (int i = 0; i < s.length(); i++) {
        f[s.charAt(i) - 'a']++;
        f[t.charAt(i) - 'a']--;
    }
    for (int x : f) if (x != 0) return false;
    return true;
}
```

- Brute force: sort both strings and compare. O(n log n).
- Optimized: frequency array. O(n).

### 8.3 Sliding window: Longest Substring Without Repeating Characters

```java
int lengthOfLongestSubstring(String s) {
    int[] last = new int[128];
    Arrays.fill(last, -1);
    int best = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (last[c] >= left) left = last[c] + 1;
        last[c] = right;
        best = Math.max(best, right - left + 1);
    }
    return best;
}
```

- Brute force: check every substring for duplicates. O(n³), or O(n²) with a set.
- Optimized: window + last-seen index. O(n).

### 8.4 Stack: Valid Parentheses

```java
boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.isEmpty()) return false;
            char top = st.pop();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) return false;
        }
    }
    return st.isEmpty();
}
```

Prefer `ArrayDeque` over `Stack`. It is faster and not synchronized.

### 8.5 Expand around center: Longest Palindromic Substring

```java
String longestPalindrome(String s) {
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        int len = Math.max(expand(s, i, i), expand(s, i, i + 1));
        if (len > end - start + 1) {
            start = i - (len - 1) / 2;
            end = i + len / 2;
        }
    }
    return s.substring(start, end + 1);
}

int expand(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
    return r - l - 1;
}
```

- Brute force: check all substrings. O(n³).
- Expand around center: O(n²).
- Manacher's: O(n).

### 8.6 Pattern matching: KMP

```java
int[] buildLPS(String p) {
    int[] lps = new int[p.length()];
    for (int i = 1, len = 0; i < p.length(); ) {
        if (p.charAt(i) == p.charAt(len)) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];
        else lps[i++] = 0;
    }
    return lps;
}

int strStr(String text, String pat) {
    if (pat.isEmpty()) return 0;
    int[] lps = buildLPS(pat);
    for (int i = 0, j = 0; i < text.length(); ) {
        if (text.charAt(i) == pat.charAt(j)) { i++; j++; }
        if (j == pat.length()) return i - j;
        else if (i < text.length() && text.charAt(i) != pat.charAt(j)) {
            if (j > 0) j = lps[j - 1]; else i++;
        }
    }
    return -1;
}
```

- Brute force: O(n·m).
- KMP: O(n + m).
- Also know: Rabin-Karp (rolling hash) and the Z-algorithm.

### 8.7 DP on strings: Edit Distance

```java
int minDistance(String a, String b) {
    int n = a.length(), m = b.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
    return dp[n][m];
}
```

Same table shape is used for LCS, longest palindromic subsequence, distinct subsequences and word break.

### 8.8 Other patterns to list

- Hashing: group anagrams (sorted string or frequency signature as map key), isomorphic strings
- Backtracking: permutations, subsets, letter combinations, palindrome partitioning
- Custom comparator: largest number (`(a, b) -> (b + a).compareTo(a + b)`)
- Bitmask: `mask |= 1 << (c - 'a')` for a-z presence checks
- Trie: autocomplete, word search II

---

## 9. Complexity gotchas

- `charAt` is O(1).
- `substring` is O(k) because it copies.
- `s1 + s2` is O(n + m).
- `s += c` inside a loop is O(n²).
- `equals` and `compareTo` are O(n).
- `hashCode` is O(n) the first time, then cached.
- `indexOf` and `contains` are O(n·m) worst case.
- `StringBuilder.append` is amortized O(1).
- `StringBuilder.insert(0, x)` and `deleteCharAt(0)` are O(n).
- `split` uses regex, so it is slower than manual parsing.

---

## 10. Common mistakes

- Using `==` instead of `.equals()`.
- Concatenating in a loop instead of using `StringBuilder`.
- Forgetting that `substring(i, j)` excludes `j`.
- Mixing up `s.length()` with the last index `s.length() - 1`.
- Not handling null or empty strings.
- `split(".")` and `split("|")` break because they are regex. Use `split("\\.")` and `split("\\|")`.
- Expecting `s.toUpperCase()` to change `s`. It returns a new string.
- Comparing `char` with `String`: `'a'` and `"a"` are different types.

---

## 11. Practice list

**Easy:** Reverse String, Valid Palindrome, Valid Anagram, Longest Common Prefix, Roman to Integer, Valid Parentheses, Implement strStr

**Medium:** Longest Substring Without Repeating Characters, Group Anagrams, Longest Palindromic Substring, String Compression, Decode String, Zigzag Conversion, Palindrome Partitioning, Word Break, Reorganize String

**Hard:** Minimum Window Substring, Edit Distance, Distinct Subsequences, Regular Expression Matching, Shortest Palindrome