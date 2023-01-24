export type Iteratee<F extends (...args: any[]) => any> =
  | symbol
  | number
  | string
  | object
  | F

export type Key = string | number | symbol

export enum TraversalType {
  PreOrder = "PreOrder",
  PostOrder = "PostOrder",
}

export enum NodeType {
  Any = "Any",
  Leaf = "Leaf",
  Tree = "Tree",
}

export type TraversalOptions = {
  visit: NodeType
  traversal: TraversalType
}

export type Context<Node> = {
  depth: number
  parents: Node[]
  parentsKeys: Key[]
}

export interface Config<Node, Children> {
  getChildren: (node: any) => Children | undefined
  setChildren: (children: any, node: Node) => Node
  mapChildren: <Node2, Children2>(
    callback: (node: Node, key: Key) => Node | Node2,
    children: Children
  ) => Children2
  forEachChildren: (
    callback: (node: Node, key: Key) => void,
    children: Children
  ) => void
  filterChildren: (
    callback: (node: Node, key: Key) => boolean,
    children: Children
  ) => Children
}
