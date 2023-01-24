import { Key, Context, Config, TraversalOptions } from "../types.ts"
import { resolveOptions, nextContext, initialContext } from "./util.ts"

export type Callback<Node> = (node: Node, key: Key, ctx: Context<Node>) => void

export const forEach =
  <Node, Children>(config: Config<Node, Children>) =>
  (
    callback: Callback<Node>,
    node: Node,
    options?: Partial<TraversalOptions>
  ): void => {
    const rec = (...[node, key, ctx]: Parameters<Callback<Node>>) => {
      let children = config.getChildren(node)

      const { canVisitPre, canVisitPost } = resolveOptions(children, options)

      if (canVisitPre) {
        callback(node, key, ctx)
      }

      // Get fresh children since the pre-order callback can mutate node such that
      // `getChildren(node)` returns a different result
      children = config.getChildren(node)

      if (children) {
        config.forEachChildren((...args) => {
          rec(...args, nextContext(node, key, ctx))
        }, children)
      }

      if (canVisitPost) {
        callback(node, key, ctx)
      }
    }

    rec(node, "", initialContext)
  }
