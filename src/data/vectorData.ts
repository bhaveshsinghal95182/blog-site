import { BlogEntry } from "@/types/blog";

export const vectorsBlogEntry: BlogEntry = {
  id: "cpp-stl-vectors-guide",
  title: "Complete Guide to C++ STL Vectors",
  meta: {
    date: "2025-12-28",
    tags: ["C++", "STL", "vectors", "data-structures"],
  },
  sections: [
    {
      id: "introduction",
      heading: "Introduction to Vectors",
      content: `## What is a Vector?

A **vector** is a dynamic array in C++ that can grow and shrink at runtime. It's part of the Standard Template Library (STL) and is the most commonly used container.

### Key Characteristics

- **Dynamic sizing** — Automatically manages memory allocation
- **Contiguous storage** — Elements stored in continuous memory
- **Random access** — O(1) access to any element by index
- **Cache friendly** — Great performance due to memory locality

### When to Use Vectors

Vectors are ideal when you:
- Need dynamic sizing without manual memory management
- Require fast random access by index
- Perform mostly operations at the end (push/pop)
- Want automatic memory cleanup`,
      codeBlocks: [
        {
          id: "vector-intro",
          language: "cpp",
          filePath: "vectors.cpp",
          chunks: [
            {
              type: "added",
              lines: [
                "#include <vector>",
                "#include <iostream>",
                "#include <algorithm>",
                "",
                "using namespace std;",
                "",
                "int main() {",
              ],
            },
            {
              type: "context",
              lines: ["    // We'll build our vector examples here", ""],
            },
          ],
        },
      ],
    },
    {
      id: "initialization",
      heading: "Creating and Initializing Vectors",
      content: `## Initialization Methods

C++ offers multiple ways to create vectors. Choose based on your use case.

### Empty Vector
Start with no elements, add later dynamically.

### Sized Vector
Pre-allocate space for known sizes — better performance.

### Initialized Vector  
Use initializer lists for known values at compile time.

### Copy Construction
Create a new vector from an existing one.`,
      codeBlocks: [
        {
          id: "vector-init",
          language: "cpp",
          filePath: "vectors.cpp",
          chunks: [
            {
              type: "context",
              lines: ["int main() {"],
            },
            {
              type: "added",
              lines: [
                "    // Empty vector",
                "    vector<int> empty;",
                "",
                "    // Vector with size (5 elements, all 0)",
                "    vector<int> sized(5);",
                "",
                "    // Vector with size and default value",
                "    vector<int> filled(5, 42);  // [42, 42, 42, 42, 42]",
                "",
                "    // Initializer list",
                "    vector<int> nums = {1, 2, 3, 4, 5};",
                "",
                "    // Copy constructor",
                "    vector<int> copy(nums);",
                "",
                "    // Range constructor",
                "    vector<int> partial(nums.begin(), nums.begin() + 3);",
              ],
            },
            {
              type: "context",
              lines: [""],
            },
          ],
        },
      ],
    },
    {
      id: "element-access",
      heading: "Accessing Elements",
      content: `## Element Access Methods

Vectors provide several ways to access elements, each with different safety guarantees.

### operator[] vs at()

- \`operator[]\` — Fast, no bounds checking (undefined behavior if out of range)
- \`at()\` — Slower, throws \`std::out_of_range\` if invalid index

### Front and Back

Quick access to first and last elements without knowing the size.

### Data Pointer

Get raw pointer to underlying array — useful for C API interop.`,
      codeBlocks: [
        {
          id: "vector-access",
          language: "cpp",
          filePath: "vectors.cpp",
          chunks: [
            {
              type: "context",
              lines: ["    vector<int> nums = {1, 2, 3, 4, 5};", ""],
            },
            {
              type: "added",
              lines: [
                "    // Access by index (no bounds check)",
                "    int first = nums[0];        // 1",
                "    int third = nums[2];        // 3",
                "",
                "    // Safe access with bounds checking",
                "    try {",
                "        int val = nums.at(10);  // throws!",
                "    } catch (out_of_range& e) {",
                '        cout << "Index out of range\\n";',
                "    }",
                "",
                "    // Front and back",
                "    int head = nums.front();    // 1",
                "    int tail = nums.back();     // 5",
                "",
                "    // Raw data pointer",
                "    int* ptr = nums.data();",
                "    cout << ptr[0] << endl;     // 1",
              ],
            },
            {
              type: "context",
              lines: [""],
            },
          ],
        },
      ],
    },
    {
      id: "modifiers",
      heading: "Adding and Removing Elements",
      content: `## Modifier Methods

These methods change the vector's contents and size.

### push_back / emplace_back

Add elements to the end. \`emplace_back\` constructs in-place (faster for objects).

### pop_back

Remove the last element. Does not return it — call \`back()\` first if needed.

### insert

Add elements at any position. Returns iterator to inserted element.

### erase

Remove elements by iterator or range. Shifts remaining elements.

### clear

Remove all elements. Capacity remains unchanged.`,
      codeBlocks: [
        {
          id: "vector-modifiers",
          language: "cpp",
          filePath: "vectors.cpp",
          chunks: [
            {
              type: "context",
              lines: ["    vector<int> nums = {1, 2, 3, 4, 5};", ""],
            },
            {
              type: "added",
              lines: [
                "    // Add to end",
                "    nums.push_back(6);          // [1,2,3,4,5,6]",
                "    nums.emplace_back(7);       // [1,2,3,4,5,6,7]",
                "",
                "    // Remove from end",
                "    nums.pop_back();            // [1,2,3,4,5,6]",
                "",
                "    // Insert at position",
                "    auto it = nums.begin() + 2;",
                "    nums.insert(it, 99);        // [1,2,99,3,4,5,6]",
                "",
                "    // Insert multiple",
                "    nums.insert(nums.end(), {8, 9, 10});",
                "",
                "    // Erase single element",
                "    nums.erase(nums.begin());   // removes first",
                "",
                "    // Erase range",
                "    nums.erase(nums.begin(), nums.begin() + 2);",
                "",
                "    // Clear all",
                "    nums.clear();               // size = 0",
              ],
            },
            {
              type: "context",
              lines: [""],
            },
          ],
        },
      ],
    },
    {
      id: "capacity",
      heading: "Size and Capacity",
      content: `## Capacity Management

Understanding size vs capacity is crucial for performance.

### Size vs Capacity

- **size()** — Number of elements currently stored
- **capacity()** — Total space allocated (can be larger than size)

### Memory Optimization

- \`reserve()\` — Pre-allocate memory to avoid reallocations
- \`shrink_to_fit()\` — Release unused memory
- \`resize()\` — Change size, adding/removing elements

### Performance Tip

When you know the approximate size upfront, use \`reserve()\` to avoid costly reallocations during \`push_back\` operations.`,
      codeBlocks: [
        {
          id: "vector-capacity",
          language: "cpp",
          filePath: "vectors.cpp",
          chunks: [
            {
              type: "context",
              lines: ["    vector<int> nums = {1, 2, 3, 4, 5};", ""],
            },
            {
              type: "added",
              lines: [
                "    // Size and capacity",
                "    cout << nums.size();       // 5",
                "    cout << nums.capacity();   // >= 5",
                "    cout << nums.empty();      // false",
                "    cout << nums.max_size();   // huge number",
                "",
                "    // Reserve capacity (avoid reallocations)",
                "    vector<int> large;",
                "    large.reserve(1000);       // capacity = 1000",
                "    // Now 1000 push_backs won't reallocate",
                "",
                "    // Resize (changes size, not just capacity)",
                "    nums.resize(10);           // size = 10, new = 0",
                "    nums.resize(20, -1);       // size = 20, new = -1",
                "    nums.resize(3);            // size = 3, truncated",
                "",
                "    // Free unused memory",
                "    nums.shrink_to_fit();",
              ],
            },
            {
              type: "context",
              lines: [""],
            },
          ],
        },
      ],
    },
    {
      id: "iterators",
      heading: "Iterators and Loops",
      content: `## Iterating Over Vectors

Multiple ways to traverse vectors, each with trade-offs.

### Iterator Types

- \`begin()/end()\` — Mutable forward iterators
- \`cbegin()/cend()\` — Const iterators (read-only)
- \`rbegin()/rend()\` — Reverse iterators

### Loop Styles

Choose based on whether you need the index and mutability requirements.`,
      codeBlocks: [
        {
          id: "vector-iterators",
          language: "cpp",
          filePath: "vectors.cpp",
          chunks: [
            {
              type: "context",
              lines: ["    vector<int> nums = {1, 2, 3, 4, 5};", ""],
            },
            {
              type: "added",
              lines: [
                "    // Range-based for (preferred)",
                "    for (int n : nums) {",
                "        cout << n << \" \";",
                "    }",
                "",
                "    // By reference (modify in place)",
                "    for (int& n : nums) {",
                "        n *= 2;  // doubles each element",
                "    }",
                "",
                "    // Iterator loop",
                "    for (auto it = nums.begin(); it != nums.end(); ++it) {",
                "        cout << *it << \" \";",
                "    }",
                "",
                "    // Reverse iteration",
                "    for (auto rit = nums.rbegin(); rit != nums.rend(); ++rit) {",
                "        cout << *rit << \" \";",
                "    }",
                "",
                "    // Index-based (when index needed)",
                "    for (size_t i = 0; i < nums.size(); ++i) {",
                '        cout << "nums[" << i << "] = " << nums[i] << "\\n";',
                "    }",
              ],
            },
            {
              type: "context",
              lines: [""],
            },
          ],
        },
      ],
    },
    {
      id: "algorithms",
      heading: "Common Algorithms",
      content: `## STL Algorithms with Vectors

The \`<algorithm>\` header provides powerful functions that work seamlessly with vectors.

### Sorting

\`sort()\` uses introsort (quicksort + heapsort + insertion sort) for O(n log n) performance.

### Searching

- \`find()\` — Linear search, returns iterator
- \`binary_search()\` — Requires sorted vector, returns bool
- \`lower_bound()/upper_bound()\` — Binary search returning positions

### Transformation

\`transform()\` applies a function to each element.`,
      codeBlocks: [
        {
          id: "vector-algorithms",
          language: "cpp",
          filePath: "vectors.cpp",
          chunks: [
            {
              type: "context",
              lines: ["    vector<int> nums = {5, 2, 8, 1, 9, 3};", ""],
            },
            {
              type: "added",
              lines: [
                "    // Sort ascending",
                "    sort(nums.begin(), nums.end());",
                "",
                "    // Sort descending",
                "    sort(nums.begin(), nums.end(), greater<int>());",
                "",
                "    // Find element",
                "    auto it = find(nums.begin(), nums.end(), 5);",
                "    if (it != nums.end()) {",
                '        cout << "Found at index " << (it - nums.begin());',
                "    }",
                "",
                "    // Binary search (must be sorted first!)",
                "    sort(nums.begin(), nums.end());",
                "    bool exists = binary_search(nums.begin(), nums.end(), 5);",
                "",
                "    // Min/Max elements",
                "    auto minIt = min_element(nums.begin(), nums.end());",
                "    auto maxIt = max_element(nums.begin(), nums.end());",
                "",
                "    // Reverse",
                "    reverse(nums.begin(), nums.end());",
                "",
                "    // Count occurrences",
                "    int count = count_if(nums.begin(), nums.end(),",
                "                         [](int n) { return n > 3; });",
              ],
            },
            {
              type: "context",
              lines: [""],
            },
          ],
        },
      ],
    },
    {
      id: "2d-vectors",
      heading: "2D Vectors (Matrices)",
      content: `## Multi-dimensional Vectors

Vectors of vectors create dynamic 2D arrays — essential for matrices, grids, and graphs.

### Initialization Patterns

- Jagged arrays — Each row can have different length
- Rectangular matrices — Fixed rows and columns
- Dynamic growth — Add rows/columns at runtime

### Access Pattern

Use \`matrix[row][col]\` syntax, same as 2D arrays.`,
      codeBlocks: [
        {
          id: "vector-2d",
          language: "cpp",
          filePath: "vectors.cpp",
          chunks: [
            {
              type: "context",
              lines: [""],
            },
            {
              type: "added",
              lines: [
                "    // 2D vector (3 rows, 4 cols, all zeros)",
                "    vector<vector<int>> matrix(3, vector<int>(4, 0));",
                "",
                "    // Access elements",
                "    matrix[0][0] = 1;",
                "    matrix[1][2] = 5;",
                "",
                "    // Initialize with values",
                "    vector<vector<int>> grid = {",
                "        {1, 2, 3},",
                "        {4, 5, 6},",
                "        {7, 8, 9}",
                "    };",
                "",
                "    // Iterate 2D vector",
                "    for (const auto& row : grid) {",
                "        for (int val : row) {",
                '            cout << val << " ";',
                "        }",
                "        cout << endl;",
                "    }",
                "",
                "    // Add new row",
                "    grid.push_back({10, 11, 12});",
                "",
                "    // Get dimensions",
                "    int rows = grid.size();",
                "    int cols = grid[0].size();",
              ],
            },
            {
              type: "context",
              lines: [""],
            },
          ],
        },
      ],
    },
    {
      id: "best-practices",
      heading: "Best Practices & Common Pitfalls",
      content: `## Best Practices

### Do's

- Use \`reserve()\` when size is known upfront
- Prefer \`emplace_back\` over \`push_back\` for objects
- Use range-based for loops when possible
- Pass vectors by reference to avoid copying

### Don'ts

- Don't access invalid indices without checking
- Don't hold iterators across modifications
- Don't forget that \`resize()\` changes size, not just capacity

### Iterator Invalidation

Modifications can invalidate iterators:
- \`push_back\` — Invalidates all if reallocation occurs
- \`insert/erase\` — Invalidates from that point forward
- \`clear\` — Invalidates all iterators`,
      codeBlocks: [
        {
          id: "vector-best-practices",
          language: "cpp",
          filePath: "vectors.cpp",
          isLast: true,
          chunks: [
            {
              type: "context",
              lines: [""],
            },
            {
              type: "added",
              lines: [
                "    // Pass by const reference (no copy)",
                "    auto printVec = [](const vector<int>& v) {",
                "        for (int n : v) cout << n << \" \";",
                "    };",
                "",
                "    // Reserve for known size",
                "    vector<int> data;",
                "    data.reserve(1000);",
                "    for (int i = 0; i < 1000; ++i) {",
                "        data.push_back(i);  // No reallocations!",
                "    }",
                "",
                "    // emplace_back for objects",
                "    struct Point { int x, y; };",
                "    vector<Point> points;",
                "    points.emplace_back(Point{1, 2});  // construct in place",
                "",
                "    // Safe erase during iteration",
                "    vector<int> v = {1, 2, 3, 4, 5};",
                "    for (auto it = v.begin(); it != v.end(); ) {",
                "        if (*it % 2 == 0) {",
                "            it = v.erase(it);  // erase returns next valid",
                "        } else {",
                "            ++it;",
                "        }",
                "    }",
              ],
            },
            {
              type: "context",
              lines: [""],
            },
            {
              type: "added",
              lines: ["    return 0;", "}"],
            },
          ],
        },
      ],
    },
  ],
};
