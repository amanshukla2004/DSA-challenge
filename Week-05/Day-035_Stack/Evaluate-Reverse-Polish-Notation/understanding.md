# Evaluate Reverse Polish Notation

- **LeetCode Number:** TBD
- **Difficulty:** Medium
- **Topic:** Stack *(Week 5 · Day 35)*
- **URL:** [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Todo

---

## 📋 Question
<!-- Short summary of the problem in your own words -->
Evaluate Postfix Notation

## 🐢 Approach 1: Evaluate Postfix

### Intuition
- Evaluate Postfix
- Number: push into stack
- Operator: pop b first, then a, compute a op b, push result
- Answer: the single value left on the stack

### Code
```java
class Solution {
    public int evalRPN(String[] tokens) {
        
        int n = tokens.length;

        Deque<Integer> st = new ArrayDeque<>();

        for(String ch : tokens){
            if(ch.length() > 1 || Character.isDigit(ch.charAt(0))){
                st.push(Integer.parseInt(ch));
            }
            /*
            ch.length() : 123 -> digit , * -> operator, -3 -> digit
            
            Character.isDigit(ch.charAt(0)) : * -> NO, -3 -> NO , 123 -> YES
            */
            else {
                int b = st.pop();
                int a = st.pop();
                int res = 0;

                switch(ch.charAt(0)){
                    case '+' : st.push(a + b); break;
                    case '-' : st.push(a - b); break;
                    case '*' : st.push(a * b); break;
                    case '/' : st.push(a / b); break;
                }

            }
        }
        return st.pop();
    }
}
```

### Complexity
- **Time Complexity (TC):** `O(N)`
- **Space Complexity (SC):** `O(N)`


