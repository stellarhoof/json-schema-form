import { foo } from "../../util.ts"
import { Tree } from "../../tree.ts"
import { Key, NodeType, TraversalType } from "../../types.ts"

export const testCases = [
  { visit: NodeType.Leaf, traversal: TraversalType.PreOrder },
  { visit: NodeType.Leaf, traversal: TraversalType.PostOrder },
  { visit: NodeType.Tree, traversal: TraversalType.PreOrder },
  { visit: NodeType.Tree, traversal: TraversalType.PostOrder },
  { visit: NodeType.Any, traversal: TraversalType.PreOrder },
  { visit: NodeType.Any, traversal: TraversalType.PostOrder },
  { visit: NodeType.Leaf, traversal: TraversalType.PreOrder },
  { visit: NodeType.Leaf, traversal: TraversalType.PostOrder },
  { visit: NodeType.Tree, traversal: TraversalType.PreOrder },
  { visit: NodeType.Tree, traversal: TraversalType.PostOrder },
  { visit: NodeType.Any, traversal: TraversalType.PreOrder },
  { visit: NodeType.Any, traversal: TraversalType.PostOrder },
]

// The interfaces are workarounds to be able to define a recursive type since
// this type `type Node<T> = T | Array<Node<T>> | Record<Key, Node<T>>` doesn't
// work
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#more-recursive-type-aliases
type Nested<T> = T | RecordOfNesteds<T> | Array<Nested<T>>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RecordOfNesteds<T> extends Record<Key, Nested<T>> {}

export const TreeOfStrings = {
  tree: new Tree<Nested<string>>(),
  getValue: (): Nested<string> => ({
    title: "The Empire Strikes Back",
    planets: ["Aldeeran", { name: "Tatooine" }],
  }),
}

export const TreeOfCollections = {
  tree: new Tree(foo("children")),
  getValue: (): Nested<string> => ({
    name: "Anakin Skywalker",
    children: [{ name: "Luke Skywalker", films: [{ title: "A New Hope" }] }],
  }),
}
