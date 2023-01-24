import {
  Key,
  Context,
  TraversalType,
  NodeType,
  TraversalOptions,
} from "../types.ts"

export const initialContext = { depth: 0, parents: [], parentsKeys: [] }

export const nextContext = <Node>(
  node: Node,
  key: Key,
  ctx: Context<Node>
): Context<Node> => ({
  depth: ctx.depth + 1,
  parents: [node, ...ctx.parents],
  parentsKeys: [key, ...ctx.parentsKeys],
})

export const resolveOptions = <Children>(
  children: Children,
  {
    visit = NodeType.Any,
    traversal = TraversalType.PreOrder,
  }: Partial<TraversalOptions> = {}
) => {
  const canVisit =
    visit === NodeType.Any ||
    (visit === NodeType.Leaf && !children) ||
    (visit === NodeType.Tree && children)
  return {
    canVisitPre: canVisit && traversal === TraversalType.PreOrder,
    canVisitPost: canVisit && traversal === TraversalType.PostOrder,
  }
}
