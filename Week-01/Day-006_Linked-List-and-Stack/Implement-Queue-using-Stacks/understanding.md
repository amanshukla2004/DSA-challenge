# Implement Queue using Stacks

- **LeetCode Number:** TBD
- **Difficulty:** Easy
- **Topic:** Linked List & Stack *(Week 1 · Day 6)*
- **URL:** [Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)
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
```java
class MyQueue {

    Deque<Integer> first = new ArrayDeque<>();
    Deque<Integer> second = new ArrayDeque<>();


    public MyQueue() {
        
    }
    
    public void push(int x) {
        first.push(x);
    }
    
    public int pop() {
        if(!second.isEmpty()) return second.pop();
        while(!first.isEmpty()){
            int popped = first.pop();
            second.push(popped);
        }
        return second.pop();
    }
    
    public int peek() {
        if(!second.isEmpty()) return second.peek();
        while(!first.isEmpty()){
            int popped = first.pop();
            second.push(popped);
        }
        return second.peek();
    }
    
    public boolean empty() {
        return (first.isEmpty() && second.isEmpty());
    }
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue obj = new MyQueue();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.peek();
 * boolean param_4 = obj.empty();
 */
```

### Complexity
- **Time Complexity (TC):** `O(...)`
- **Space Complexity (SC):** `O(...)`

---

