# Stack: Java Revision Notes

## 1. Basics

- LIFO (Last In, First Out)
- Core ops, all O(1): `push`, `pop`, `peek`, `isEmpty`, `size`
- Use cases: undo, recursion (call stack), parsing, backtracking, monotonic problems

## 2. Stack in Java

### Use `Deque`, not `Stack`

- `Stack` class is legacy (extends `Vector`, synchronized, slow)
- Preferred: `Deque<Integer> st = new ArrayDeque<>();`

```java
Deque<Integer> st = new ArrayDeque<>();
st.push(10);          // add on top
st.pop();             // remove top, throws NoSuchElementException if empty
st.peek();            // view top, returns null if empty
st.isEmpty();
st.size();
```

### Legacy `Stack` (still appears in old code)

```java
Stack<Integer> st = new Stack<>();
st.push(1);
st.pop();
st.peek();       // throws EmptyStackException if empty
st.empty();      // note: empty(), not isEmpty()
st.search(1);    // 1-based distance from top, -1 if absent
```

### Gotchas

- `ArrayDeque` does not allow `null`
- `push/pop/peek` on `Deque` work on the **head** (front)
- Iterating a `Deque` used as stack goes top → bottom
- Iterating legacy `Stack` goes bottom → top
- Compare boxed values with `.equals()`, not `==` (`Integer` cache issue beyond 127)
- Storing indices is more common than values in monotonic stack problems
- Store pairs: `st.push(new int[]{val, idx});`

### Other types

```java
Deque<Character> st = new ArrayDeque<>();
Deque<int[]> st = new ArrayDeque<>();
Deque<String> st = new ArrayDeque<>();
```

## 3. Manual Implementations

### Array based

```java
class MyStack {
    int[] arr; int top = -1;
    MyStack(int n) { arr = new int[n]; }
    void push(int x) { if (top == arr.length - 1) throw new RuntimeException("Overflow"); arr[++top] = x; }
    int pop()  { if (top == -1) throw new RuntimeException("Underflow"); return arr[top--]; }
    int peek() { return arr[top]; }
    boolean isEmpty() { return top == -1; }
}
```

### Linked list based

```java
class Node { int val; Node next; Node(int v) { val = v; } }

class LLStack {
    Node head;
    void push(int x) { Node n = new Node(x); n.next = head; head = n; }
    int pop() { int v = head.val; head = head.next; return v; }
    int peek() { return head.val; }
    boolean isEmpty() { return head == null; }
}
```

## 4. Prefix / Infix / Postfix

| Type    | Form    | Example (A+B*C) |
|---------|---------|-----------------|
| Infix   | A op B  | `A+B*C`         |
| Prefix  | op A B  | `+A*BC`         |
| Postfix | A B op  | `ABC*+`         |

### Precedence

- `^` highest, right associative
- `* / %`
- `+ -` lowest
- Same precedence → left to right (except `^`)

### Infix → Postfix

1. Operand → append to output
2. `(` → push
3. `)` → pop to output until `(`
4. Operator → pop while top has **higher or equal** precedence (for `^`: strictly higher), then push
5. End → pop all remaining

```java
static int prec(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return -1;
}

static String infixToPostfix(String s) {
    StringBuilder sb = new StringBuilder();
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) sb.append(c);
        else if (c == '(') st.push(c);
        else if (c == ')') {
            while (!st.isEmpty() && st.peek() != '(') sb.append(st.pop());
            st.pop(); // remove '('
        } else {
            while (!st.isEmpty() && prec(st.peek()) >= prec(c)
                   && !(c == '^' && st.peek() == '^')) // right assoc
                sb.append(st.pop());
            st.push(c);
        }
    }
    while (!st.isEmpty()) sb.append(st.pop());
    return sb.toString();
}
```

### Infix → Prefix

1. Reverse the infix string
2. Swap `(` ↔ `)`
3. Convert to postfix with one change in the pop rule:
   - `^` → pop while `prec(top) >= prec(c)`
   - all other operators → pop while `prec(top) > prec(c)` (strictly greater)
4. Reverse the result

### Infix → Postfix: dry runs

**Rule:** before pushing an operator, pop every waiting operator with higher precedence (or equal, except `^`).

`A+B*C` → `ABC*+`

| Char | Action | Stack | Output |
|---|---|---|---|
| A | output | | A |
| + | push | + | A |
| B | output | + | AB |
| * | higher than `+`, push | + * | AB |
| C | output | + * | ABC |
| end | pop all | | ABC*+ |

`(A+B)*C` → `AB+C*`

| Char | Action | Stack | Output |
|---|---|---|---|
| ( | push | ( | |
| A | output | ( | A |
| + | push | ( + | A |
| B | output | ( + | AB |
| ) | pop until `(` | | AB+ |
| * | push | * | AB+ |
| C | output | * | AB+C |
| end | pop all | | AB+C* |

`A-B+C` → `AB-C+` (equal precedence, left to right, so `-` pops first)

### Postfix → Infix

- Operand: push as string
- Operator: pop `b` (right) first, then `a` (left), push `"(" + a + op + b + ")"`

Dry run `AB+C*`: push A, push B, `+` → `(A+B)`, push C, `*` → `((A+B)*C)`

```java
static String postfixToInfix(String s) {
    Deque<String> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) st.push(String.valueOf(c));
        else {
            String b = st.pop();
            String a = st.pop();
            st.push("(" + a + c + b + ")");
        }
    }
    return st.pop();
}
```

### Other conversions (same shape, only pop order and scan direction change)

```java
// Postfix → Prefix (scan left to right)
String b = st.pop(), a = st.pop();
st.push(c + a + b);

// Prefix → Postfix (scan RIGHT to left)
String a = st.pop(), b = st.pop();   // first pop is LEFT operand
st.push(a + b + c);

// Prefix → Infix (scan RIGHT to left)
String a = st.pop(), b = st.pop();
st.push("(" + a + c + b + ")");
```

Memory trick: scanning left to right → first pop is the right operand. Scanning right to left → first pop is the left operand.

### Evaluate Postfix

- Number: push
- Operator: pop `b` first, then `a`, compute `a op b`, push result
- Answer: the single value left on the stack

Dry run `2 3 1 * + 9 -` (= 2 + 3*1 - 9 = -4)

| Token | Action | Stack (top on right) |
|---|---|---|
| 2 | push | 2 |
| 3 | push | 2 3 |
| 1 | push | 2 3 1 |
| * | b=1, a=3, push 3 | 2 3 |
| + | b=3, a=2, push 5 | 5 |
| 9 | push | 5 9 |
| - | b=9, a=5, push -4 | -4 |

```java
static int evalPostfix(String[] tokens) {   // tokens split by space
    Deque<Integer> st = new ArrayDeque<>();
    for (String t : tokens) {
        if (t.length() > 1 || Character.isDigit(t.charAt(0))) {   // number (handles negatives and multi-digit)
            st.push(Integer.parseInt(t));
        } else {
            int b = st.pop(), a = st.pop();
            switch (t.charAt(0)) {
                case '+': st.push(a + b); break;
                case '-': st.push(a - b); break;
                case '*': st.push(a * b); break;
                case '/': st.push(a / b); break;   // int division truncates toward zero
            }
        }
    }
    return st.pop();
}
```

Order of `a` and `b` only matters for `-` and `/`.

### Evaluate Prefix

- Scan **right to left**
- Number: push
- Operator: pop `a` first (left), then `b` (right), push `a op b`

Dry run `* + 2 3 4` (= (2+3)*4 = 20): push 4, push 3, push 2, `+` → a=2, b=3 → 5, `*` → a=5, b=4 → 20

```java
static int evalPrefix(String[] tokens) {
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = tokens.length - 1; i >= 0; i--) {
        String t = tokens[i];
        if (t.length() > 1 || Character.isDigit(t.charAt(0))) st.push(Integer.parseInt(t));
        else {
            int a = st.pop(), b = st.pop();   // a is LEFT here
            switch (t.charAt(0)) {
                case '+': st.push(a + b); break;
                case '-': st.push(a - b); break;
                case '*': st.push(a * b); break;
                case '/': st.push(a / b); break;
            }
        }
    }
    return st.pop();
}
```

### Evaluate Infix directly (two stacks)

- `nums` stack for numbers, `ops` stack for operators
- Number: read full digits, push to `nums`
- `(`: push to `ops`
- `)`: apply operators until `(`, discard it
- Operator: while top of `ops` has higher or equal precedence, apply it; then push the new operator
- End: apply everything left

Same pop rule as infix → postfix, but instead of writing to output we compute immediately.

```java
static int evalInfix(String s) {
    Deque<Integer> nums = new ArrayDeque<>();
    Deque<Character> ops = new ArrayDeque<>();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == ' ') continue;
        if (Character.isDigit(c)) {
            int n = 0;
            while (i < s.length() && Character.isDigit(s.charAt(i))) n = n * 10 + (s.charAt(i++) - '0');
            i--;
            nums.push(n);
        } else if (c == '(') ops.push(c);
        else if (c == ')') {
            while (ops.peek() != '(') apply(nums, ops.pop());
            ops.pop();
        } else {
            while (!ops.isEmpty() && prec(ops.peek()) >= prec(c)) apply(nums, ops.pop());
            ops.push(c);
        }
    }
    while (!ops.isEmpty()) apply(nums, ops.pop());
    return nums.pop();
}

static void apply(Deque<Integer> nums, char op) {
    int b = nums.pop(), a = nums.pop();
    switch (op) {
        case '+': nums.push(a + b); break;
        case '-': nums.push(a - b); break;
        case '*': nums.push(a * b); break;
        case '/': nums.push(a / b); break;
    }
}
// prec('(') must return -1 so the while loop stops at '('. No unary minus handling here.
```

## 5. Core Patterns

### 5.1 Matching / Balanced Parentheses

- Push opening, on closing check top matches
- Valid only if stack empty at end

```java
static boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.isEmpty()) return false;
            char t = st.pop();
            if ((c == ')' && t != '(') || (c == '}' && t != '{') || (c == ']' && t != '[')) return false;
        }
    }
    return st.isEmpty();
}
```

Related: Min Add to Make Valid, Longest Valid Parentheses, Remove Invalid Parentheses, Minimum Remove to Make Valid.

### 5.2 Monotonic Stack

Keeps elements in sorted order (increasing or decreasing). Each element pushed/popped once → O(n).

| Goal                        | Stack type          | Pop when                |
|-----------------------------|---------------------|-------------------------|
| Next Greater Element        | Decreasing (values) | `arr[top] < arr[i]`     |
| Next Smaller Element        | Increasing (values) | `arr[top] > arr[i]`     |
| Previous Greater / Smaller  | Same, read answer from top **before** push | same |

**Brute force:** for each `i`, scan right until a greater element is found → O(n²).
**Optimized:** monotonic stack of indices → O(n).

#### Next Greater Element (right side)

```java
static int[] nextGreater(int[] a) {
    int n = a.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    Deque<Integer> st = new ArrayDeque<>(); // indices
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && a[st.peek()] < a[i])
            res[st.pop()] = a[i];
        st.push(i);
    }
    return res;
}
```

#### Previous Smaller Element

```java
static int[] prevSmaller(int[] a) {
    int n = a.length;
    int[] res = new int[n];
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && a[st.peek()] >= a[i]) st.pop();
        res[i] = st.isEmpty() ? -1 : a[st.peek()];
        st.push(i);
    }
    return res;
}
```

#### Circular array (Next Greater II)

- Loop `i` from `0` to `2n-1`, use `i % n`
- Push indices only when `i < n`

#### Daily Temperatures

- Same as next greater, store `i - st.pop()` as answer

#### Stock Span

- Pop while `price[top] <= price[i]`
- Span = `i - (st.isEmpty() ? -1 : st.peek())`

### 5.3 Histogram Problems

#### Largest Rectangle in Histogram

**Brute force:** for each bar, expand left and right while bars are `>=` its height → O(n²).
**Optimized:** for each bar find previous smaller (PSE) and next smaller (NSE) index.
Width = `NSE - PSE - 1`, area = `h * width`.

**Single pass:**

```java
static int largestRectangle(int[] h) {
    Deque<Integer> st = new ArrayDeque<>();
    int max = 0, n = h.length;
    for (int i = 0; i <= n; i++) {
        int cur = (i == n) ? 0 : h[i]; // sentinel 0 flushes the stack
        while (!st.isEmpty() && h[st.peek()] > cur) {
            int height = h[st.pop()];
            int left = st.isEmpty() ? -1 : st.peek();
            max = Math.max(max, height * (i - left - 1));
        }
        st.push(i);
    }
    return max;
}
```

#### Maximal Rectangle (binary matrix)

- Build histogram row by row (`height[j] = matrix[i][j]=='1' ? height[j]+1 : 0`)
- Apply largest rectangle on each row

#### Trapping Rain Water

**Brute force:** for each `i`, `min(maxLeft, maxRight) - h[i]` → O(n²).
**Better:** prefix max and suffix max arrays → O(n) time, O(n) space.
**Stack approach:**

```java
static int trap(int[] h) {
    Deque<Integer> st = new ArrayDeque<>();
    int water = 0;
    for (int i = 0; i < h.length; i++) {
        while (!st.isEmpty() && h[st.peek()] < h[i]) {
            int mid = st.pop();
            if (st.isEmpty()) break;
            int left = st.peek();
            int width = i - left - 1;
            int ht = Math.min(h[left], h[i]) - h[mid];
            water += width * ht;
        }
        st.push(i);
    }
    return water;
}
```

(Two pointers gives O(1) space, also worth knowing.)

### 5.4 Min Stack / Max Stack

**Approach 1: two stacks**

```java
class MinStack {
    Deque<Integer> st = new ArrayDeque<>(), min = new ArrayDeque<>();
    void push(int x) {
        st.push(x);
        if (min.isEmpty() || x <= min.peek()) min.push(x); // <= handles duplicates
    }
    void pop() { if (st.pop().equals(min.peek())) min.pop(); }
    int top() { return st.peek(); }
    int getMin() { return min.peek(); }
}
```

**Approach 2: O(1) space (encode)**

- Push `2*x - min` when `x < min`, set `min = x`
- On pop, if top `< min`: `min = 2*min - top`
- Use `long` to avoid overflow

### 5.5 Stack ↔ Queue

#### Queue using two stacks

- `push`: push to `in`
- `pop/peek`: if `out` empty, move everything `in → out`, then pop/peek `out`
- Amortized O(1)

#### Stack using queue(s)

- Single queue: after `offer(x)`, rotate `size-1` times so `x` reaches front
- `push` O(n), `pop` O(1)

### 5.6 Recursion with Stack

#### Reverse a stack (no extra DS)

```java
static void reverse(Deque<Integer> st) {
    if (st.isEmpty()) return;
    int x = st.pop();
    reverse(st);
    insertAtBottom(st, x);
}
static void insertAtBottom(Deque<Integer> st, int x) {
    if (st.isEmpty()) { st.push(x); return; }
    int t = st.pop();
    insertAtBottom(st, x);
    st.push(t);
}
```

#### Sort a stack

```java
static void sort(Deque<Integer> st) {
    if (st.isEmpty()) return;
    int x = st.pop();
    sort(st);
    sortedInsert(st, x);
}
static void sortedInsert(Deque<Integer> st, int x) {
    if (st.isEmpty() || st.peek() <= x) { st.push(x); return; }
    int t = st.pop();
    sortedInsert(st, x);
    st.push(t);
}
```

### 5.7 String Processing

#### Remove Adjacent Duplicates

- Push char; if equal to top, pop instead
- Build result from stack (reverse it, or use `StringBuilder` as the stack)

```java
StringBuilder sb = new StringBuilder(); // StringBuilder as stack
for (char c : s.toCharArray()) {
    int n = sb.length();
    if (n > 0 && sb.charAt(n - 1) == c) sb.deleteCharAt(n - 1);
    else sb.append(c);
}
```

#### Remove K Digits

- Greedy: while `k > 0` and top `> current digit`, pop and `k--`
- After loop, pop remaining `k` from end
- Strip leading zeros, return `"0"` if empty

#### Decode String (`3[a2[c]]`)

- Two stacks: counts and strings
- `[` → push current string and count, reset
- `]` → pop count and previous string, `prev + cur.repeat(count)`
- Digit → build multi-digit number

#### Simplify Path

- Split by `/`
- Skip `""` and `"."`, pop on `".."` (if non-empty), else push
- Join with `/`

#### Remove Duplicate Letters / Smallest Subsequence

- Track `lastIndex`, `inStack[]`
- Pop while top `> c` and top appears later again

### 5.8 Expression Evaluation

#### Basic Calculator (`+ - ( )`)

- Keep `sign`, `result`, `num`
- On `(`: push `result` and `sign`, reset
- On `)`: `result = result * poppedSign + poppedResult`

#### Basic Calculator II (`+ - * /`, no brackets)

- Keep `lastOp`
- `+` push `num`, `-` push `-num`, `*` / `/` combine with top
- Sum the stack at the end

### 5.9 Collision / Simulation

#### Asteroid Collision

- Positive → push
- Negative → while top positive and smaller, pop; if equal, pop both; if top larger, discard current; if stack empty or top negative, push

#### Car Fleet

- Sort by position descending, compute time to reach target
- Push time only if greater than top (new fleet)

### 5.10 Other Classics

- **Celebrity Problem:** push all, pop two, eliminate one, verify last candidate
- **Valid Stack Sequences:** push from `pushed`, pop while top equals `popped[j]`
- **Sum of Subarray Minimums:** for each `i`, `left = i - PSE`, `right = NSE - i`, contribution `a[i] * left * right` (use `<` on one side and `<=` on other to handle duplicates), mod `1e9+7`
- **132 Pattern:** scan right to left, maintain stack and `third` (the "2")
- **Online Stock Span, Next Greater Node in Linked List, Number of Visible People in a Queue**
- **Iterative DFS / Inorder / Preorder traversal:** explicit stack instead of recursion
- **Flatten nested list iterator, Backspace String Compare, Remove Outermost Parentheses**

## 6. Recognise the Pattern

| If the problem says...                                | Think                          |
|-------------------------------------------------------|--------------------------------|
| Brackets / valid / nested                             | Matching stack                 |
| Next / previous greater or smaller                    | Monotonic stack                |
| Span, temperatures, visible, histogram                | Monotonic stack                |
| Undo, adjacent removal, reduce pairs                  | Plain stack                    |
| Evaluate / convert expression                         | Operand + operator stack       |
| Nested structure with repeat / path                   | Stack of states                |
| Convert recursion to iteration                        | Explicit stack                 |
| Get min/max in O(1)                                   | Auxiliary stack or encoding    |
| Remove k elements to get smallest/largest             | Greedy monotonic stack         |

## 7. Monotonic Stack Template

```java
Deque<Integer> st = new ArrayDeque<>(); // indices
for (int i = 0; i < n; i++) {
    while (!st.isEmpty() && /* condition on a[st.peek()] vs a[i] */) {
        int idx = st.pop();
        // idx's answer is i (next) ; st.peek() is its previous
    }
    st.push(i);
}
```

- Next side answer: found at pop time
- Previous side answer: `st.peek()` after popping, before push
- Elements left in stack have no next greater/smaller
- Duplicates: decide `<` vs `<=` deliberately

## 8. Complexity Cheat Sheet

| Problem                    | Time | Space |
|----------------------------|------|-------|
| Push / Pop / Peek          | O(1) | O(n)  |
| Balanced parentheses       | O(n) | O(n)  |
| Next Greater / Smaller     | O(n) | O(n)  |
| Largest Rectangle          | O(n) | O(n)  |
| Maximal Rectangle          | O(rows*cols) | O(cols) |
| Trapping Rain Water (stack)| O(n) | O(n)  |
| Min Stack                  | O(1) per op | O(n) or O(1) |
| Queue via two stacks       | O(1) amortized | O(n) |
| Sort stack (recursion)     | O(n²)| O(n)  |
| Infix → Postfix            | O(n) | O(n)  |

## 9. Common Mistakes

- Calling `pop()/peek()` on empty stack → always check `isEmpty()`
- Using `Stack` instead of `Deque`
- Pushing values when you need indices (width calculation breaks)
- Wrong operand order in postfix (`b` popped first, then `a`)
- Forgetting to flush the stack at the end (use sentinel or a cleanup loop)
- `Integer` comparison with `==` instead of `.equals()`
- Wrong duplicate handling in sum-of-subarray-minimums
- Integer overflow in Min Stack encoding or sums (use `long`)