# Min Stack

- **LeetCode Number:** TBD
- **Difficulty:** Medium
- **Topic:** Stack *(Week 5 · Day 35)*
- **URL:** [Min Stack](https://leetcode.com/problems/min-stack/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Todo

---

---

## 🧠 Intuition
The problem: get the minimum in O(1) while pushing and popping.

The key observation: the minimum only changes when you push something smaller or pop the current minimum. So the minimum at any moment depends only on what is currently in the stack, and it "rewinds" in the exact reverse order it was set.

That reverse order is itself stack behavior. So the history of minimums can live in a second stack.

Picture it: you push 5, 3, 7.

Min is 5, then 3, then still 3 after 7
Pop 7: min is still 3
Pop 3: min goes back to 5

The minimum "5" had to be remembered somewhere while 3 was on top. That memory is the min stack.

#### Optimization : store a min only when it changes
- Push onto min only when val <= min.peek() (or min is empty)
- On pop: if the popped value equals min.peek(), pop min too
- <= matters: each copy of a duplicate minimum needs its own entry, otherwise popping one copy loses the min while another copy is still in the stack (the bug in your code)
- Same O(1) time, less space when most pushes aren't new minimums
### Code
```java
class MinStack {
    Deque<Integer> st = new ArrayDeque<>(), min = new ArrayDeque<>();
    public MinStack() {
        
    }
    
    public void push(int value) {
        st.push(value);

        if(min.isEmpty() || value <= min.peek()){
            min.push(value);
        }
    }
    
    public void pop() {
        int popped = st.pop();

        if(min.peek() == popped) min.pop();
    }
    
    public int top() {
        return st.peek();
    }
    
    public int getMin() {
        return min.peek();
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack obj = new MinStack();
 * obj.push(value);
 * obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.getMin();
 */
```

### Complexity
- **Time Complexity (TC):** `O(...)`
- **Space Complexity (SC):** `O(...)`

---
