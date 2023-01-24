import { SimpleTree, TreeWithChildrenKey } from "./trees.js"
import { NodeType, TraversalType } from "../util/traversal.js"

export const testCases = [
  {
    ...SimpleTree,
    options: { visit: NodeType.Leaf, traversal: TraversalType.PreOrder },
  },
  {
    ...SimpleTree,
    options: { visit: NodeType.Leaf, traversal: TraversalType.PostOrder },
  },
  {
    ...SimpleTree,
    options: { visit: NodeType.Tree, traversal: TraversalType.PreOrder },
  },
  {
    ...SimpleTree,
    options: { visit: NodeType.Tree, traversal: TraversalType.PostOrder },
  },
  {
    ...SimpleTree,
    options: { visit: NodeType.Any, traversal: TraversalType.PreOrder },
  },
  {
    ...SimpleTree,
    options: { visit: NodeType.Any, traversal: TraversalType.PostOrder },
  },
  {
    ...TreeWithChildrenKey,
    options: { visit: NodeType.Leaf, traversal: TraversalType.PreOrder },
  },
  {
    ...TreeWithChildrenKey,
    options: { visit: NodeType.Leaf, traversal: TraversalType.PostOrder },
  },
  {
    ...TreeWithChildrenKey,
    options: { visit: NodeType.Tree, traversal: TraversalType.PreOrder },
  },
  {
    ...TreeWithChildrenKey,
    options: { visit: NodeType.Tree, traversal: TraversalType.PostOrder },
  },
  {
    ...TreeWithChildrenKey,
    options: { visit: NodeType.Any, traversal: TraversalType.PreOrder },
  },
  {
    ...TreeWithChildrenKey,
    options: { visit: NodeType.Any, traversal: TraversalType.PostOrder },
  },
]
