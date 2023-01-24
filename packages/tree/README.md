# Tree utils

## Usage

```typescript
const T = new Tree<Node, Children>({
  getChildren
  setChildren
  mapChildren
  forEachChildren
  filterChildren
})

const CT = new CollectionTree<Node>({
  getChildren,
  setChildren
})

{T,CT}.map(fn, tree, { visit, traversal })
```

## TODO

- get/set path
- async traversal
- Tree.map(...) should be equivalent to new Tree().map(...)
- Test that options get inherited if a tree instance gets built
