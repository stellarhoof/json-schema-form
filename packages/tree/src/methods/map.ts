import iteratee from "lodash/iteratee.js"
import {
  Key,
  Iteratee,
  Context,
  Config,
  TraversalOptions,
  TraversalType,
} from "../types.ts"
import { resolveOptions, nextContext, initialContext } from "./util.ts"

export type Callback<Node, Node2> = (
  node: Node,
  key: Key,
  ctx: Context<Node>
) => Node2

export const map =
  <Node, Children, Node2, Children2>(config: Config<Node, Children>) =>
  (
    callback: Iteratee<Callback<Node, Node2>>,
    node: Node,
    options?: Partial<Omit<TraversalOptions, "traversal">>
  ): Node | Node2 => {
    const it: Callback<Node, Node2> = iteratee(callback)

    const rec = (...[node, key, ctx]: Parameters<typeof it>): Node | Node2 => {
      const children = config.getChildren(node)

      // Force a post-order traversal to prevent a pre-order traversal from
      // changing the structure of the tree
      const { canVisitPost } = resolveOptions(children, {
        ...options,
        traversal: TraversalType.PostOrder,
      })

      if (children) {
        const mapped = config.mapChildren<Node2, Children2>(
          (...args) => rec(...args, nextContext(node, key, ctx)),
          children
        )
        node = config.setChildren(mapped, node)
      }

      if (canVisitPost) {
        // I do want to change the type of `node` thank you very much
        // @ts-ignore
        node = it(node, key, ctx)
      }

      return node
    }

    return rec(node, "", initialContext)
  }
