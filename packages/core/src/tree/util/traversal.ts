import isPlainObject from "lodash/isPlainObject.js"
import { Key, Collection } from "./collection.js"

export type Iteratee<F extends (...args: any[]) => any> =
  | symbol
  | number
  | string
  | object
  | F

export enum TraversalType {
  PreOrder = "PreOrder",
  PostOrder = "PostOrder",
}

export enum NodeType {
  Any = "Any",
  Leaf = "Leaf",
  Tree = "Tree",
}

export type Options<T> = {
  visit: NodeType
  traversal: TraversalType
  getChildren: (node: T) => Collection<T> | undefined
  setChildren: (children: Collection<T>, node: T) => T
}

export type Context<T> = {
  depth: number
  parents: T[]
  parentsKeys: Key[]
}

export const initialContext = { depth: 0, parents: [], parentsKeys: [] }

export const nextContext = <T>(
  node: T,
  key: Key,
  context: Context<T>
): Context<T> => ({
  depth: context.depth + 1,
  parents: [node, ...context.parents],
  parentsKeys: [key, ...context.parentsKeys],
})

export const resolveOptions = <T>(
  node: T,
  { visit, traversal, getChildren, setChildren }: Partial<Options<T>> = {}
) => {
  visit ??= NodeType.Any
  traversal ??= TraversalType.PreOrder
  setChildren ??= (children) => {
    return children as unknown as T
  }
  getChildren ??= (node) => {
    if (node instanceof Array || isPlainObject(node)) {
      return node as unknown as Collection<T>
    }
  }
  const children = getChildren(node)
  const canVisit =
    visit === NodeType.Any ||
    (visit === NodeType.Leaf && !children) ||
    (visit === NodeType.Tree && children)
  return {
    children,
    setChildren,
    getChildren,
    canVisitPre: canVisit && traversal === TraversalType.PreOrder,
    canVisitPost: canVisit && traversal === TraversalType.PostOrder,
  }
}
