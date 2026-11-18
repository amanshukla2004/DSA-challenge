# Find Winner on a Tic Tac Toe Game
 
- **LeetCode Number:** 1275
- **Difficulty:** Easy
- **Topic:** Arrays *(Week 1 · Day 3)*
- **URL:** [Find Winner on a Tic Tac Toe Game](https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game/)
- **YouTube:** <!-- paste YouTube link here -->
- **Need Revision:** No
- **Status:** Todo
---
 
## 📋 Question
- Players A and B alternate moves on a 3x3 grid, A first (`X`), B second (`O`).
- `moves[i] = [row, col]` is the i-th move.
- Return `"A"` or `"B"` if someone completed a row, column, or diagonal.
- Otherwise return `"Draw"` if all 9 cells are filled, else `"Pending"`.
### 📏 Constraints
- `1 <= moves.length <= 9`, so the board is tiny and everything is effectively `O(1)`.
- No cell is repeated and the moves are valid, so the game stops at the first win and there is never more than one winner.
<details>
<summary><strong>💡 Hint</strong></summary>
A win can only be created by the last move played. You never need to re-scan the whole board.
 
</details>
---
 
## 🧠 Intuition
- Encode A as `+1` and B as `-1`. A line owned by one player sums to `±3`.
- Only the row, column, and (if applicable) diagonals through the latest move can change, so you can track those sums directly.
---
 
## 🐢 Approach 1: Brute Force : my approach and other approach i did not understand
 
### Intuition
- Replay all moves onto a 3x3 grid, A as `+1` and B as `-1`.
- Scan all 3 rows, 3 columns, and 2 diagonals for a sum of `±3`.
- If no winner, check for any empty cell: `"Pending"` if one exists, else `"Draw"`.
- It is wasteful because it builds the whole board and rescans every line, even though only the last move could have created a win.
- Checking only at the end is still correct because the moves are guaranteed valid, so at most one winner exists.
### Code
```java
// Brute Force solution
class Solution {
    public String tictactoe(int[][] moves) {
        // brute force 
        // create tic-tac board
        int[][] grid = new int[3][3];
 
 
        boolean chance = true; // true ->chance of 'A'
 
        for(int[] m : moves){
            int x = m[0];
            int y = m[1];
 
            int ch = (chance == true) ? 1 : -1;
 
            grid[x][y] = ch;
            chance = !chance;
        }
 
        // who wins or pending
 
        
        // horizontal
        for(int i=0; i<3; i++){
            int sum = 0;
            for(int j=0; j<3; j++){
                sum += grid[i][j];
            }
            if(sum == 3) return "A";
            if(sum == -3) return "B";
        }
        // vertical
        for(int i=0; i<3; i++){
            int sum = 0;
            for(int j=0; j<3; j++){
                sum += grid[j][i];
            }
            if(sum == 3) return "A";
            if(sum == -3) return "B";
        }
        int rightDia = grid[0][0] + grid[1][1] + grid[2][2];
        int leftDia = grid[0][2] + grid[1][1] + grid[2][0];
        if(rightDia == 3) return "A";
        if(rightDia == -3) return "B";
        if(leftDia == 3) return "A";
        if(leftDia == -3) return "B";
 
        // pending
        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                if(grid[i][j] == 0) return "Pending";
            }
        }
 
        return "Draw";
 
        
    }
}
```
 
### Complexity
- **Time Complexity (TC):** `O(n + 9)` → `O(1)`
- **Space Complexity (SC):** `O(1)` (3x3 grid)
---
 
## ⚡ Approach 2: Better
 
### Intuition
- Check for a win right after each move, and only the lines through that cell.
- Return early on the first win.
- It still stores the grid and compares 3 cells per line.
### Code
```java
// Better solution
class Solution {
    public String tictactoe(int[][] moves) {
        int[][] grid = new int[3][3];
        int player = 1; // 1 -> A, -1 -> B
 
        for (int[] m : moves) {
            int r = m[0], c = m[1];
            grid[r][c] = player;
            if (wins(grid, r, c, player)) return player == 1 ? "A" : "B";
            player = -player;
        }
        return moves.length == 9 ? "Draw" : "Pending";
    }
 
    private boolean wins(int[][] g, int r, int c, int p) {
        if (g[r][0] == p && g[r][1] == p && g[r][2] == p) return true;
        if (g[0][c] == p && g[1][c] == p && g[2][c] == p) return true;
        if (r == c && g[0][0] == p && g[1][1] == p && g[2][2] == p) return true;
        if (r + c == 2 && g[0][2] == p && g[1][1] == p && g[2][0] == p) return true;
        return false;
    }
}
```
 
### Complexity
- **Time Complexity (TC):** `O(n)` → `O(1)` since n ≤ 9
- **Space Complexity (SC):** `O(1)`
---
 
## 🚀 Approach 3: Optimised
 
### Intuition
- Drop the grid. Keep running sums: `rows[3]`, `cols[3]`, `diag`, `anti`.
- Each move adds `+1` or `-1` to its row, its column, `diag` if `r == c`, and `anti` if `r + c == 2`.
- If any of those has absolute value 3, the current player wins.
- Each move is `O(1)` work with no board scan.
- The same idea generalises to an n x n board with `O(n)` space (LeetCode 348, Design Tic-Tac-Toe).
### Code
```java
// Optimised solution
class Solution {
    public String tictactoe(int[][] moves) {
        int[] rows = new int[3], cols = new int[3];
        int diag = 0, anti = 0;
        int player = 1; // 1 -> A, -1 -> B
 
        for (int[] m : moves) {
            int r = m[0], c = m[1];
            rows[r] += player;
            cols[c] += player;
            if (r == c) diag += player;
            if (r + c == 2) anti += player;
 
            if (Math.abs(rows[r]) == 3 || Math.abs(cols[c]) == 3
                || Math.abs(diag) == 3 || Math.abs(anti) == 3) {
                return player == 1 ? "A" : "B";
            }
            player = -player;
        }
        return moves.length == 9 ? "Draw" : "Pending";
    }
}
```
 
### Complexity
- **Time Complexity (TC):** `O(n)` → `O(1)`
- **Space Complexity (SC):** `O(1)` (generalises to `O(board size)` for an n x n board)
---
 
## ⚠️ Edge Cases & Mistakes
- The center cell `(1,1)` lies on both diagonals, so both `diag` and `anti` must update.
- Anti-diagonal condition is `r + c == 2`, not `r != c`.
- `Draw` is only valid when `moves.length == 9` and no one has won. Check the win first, then draw.
- Fewer than 9 moves with no winner is `"Pending"`, even if it looks stuck.
 