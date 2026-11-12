# Java DSA Cheat Sheet

A quick reference for Java collections, idioms, and complexity rules used across solutions.

## Collections & Common Operations

| Structure | Java Class | Common Methods | Time Complexity |
|---|---|---|---|
| Dynamic Array | `ArrayList<>` | `add`, `get`, `set`, `remove(last)` | `O(1)` amortized |
| Hash Map | `HashMap<K, V>` | `put`, `getOrDefault`, `containsKey`, `computeIfAbsent` | `O(1)` avg |
| Hash Set | `HashSet<T>` | `add`, `contains`, `remove` | `O(1)` avg |
| Stack / Queue | `ArrayDeque<T>` | `push`, `pop`, `offer`, `poll`, `peek` | `O(1)` |
| Min / Max Heap | `PriorityQueue<T>` | `offer`, `poll`, `peek` | `O(log n)` / `O(1)` |
| Balanced BST | `TreeMap<K, V>` | `floorKey`, `ceilingKey`, `firstKey`, `lastKey` | `O(log n)` |

## Useful Snippets

```java
// Custom comparator (Max-Heap)
PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> Integer.compare(b, a));

// Frequency map
Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
```
