import { Key, Context, Config, TraversalOptions } from "../types.ts"
import { resolveOptions, nextContext, initialContext } from "./util.ts"

export type Callback<Result, Node> = (
  result: Result,
  node: Node,
  key: Key,
  ctx: Context<Node>
) => Result

export const reduce =
  <Result, Node, Children>(config: Config<Node, Children>) =>
  (
    callback: Callback<Result, Node>,
    node: Node,
    init: Result,
    options?: Partial<TraversalOptions>
  ): Result => {
    const rec: typeof callback = (result, node, key, ctx) => {
      const children = config.getChildren(node)

      const { canVisitPre, canVisitPost } = resolveOptions(children, options)

      if (canVisitPre) {
        result = callback(result, node, key, ctx)
      }

      if (children) {
        config.forEachChildren((...args) => {
          result = rec(result, ...args, nextContext(node, key, ctx))
        }, children)
      }

      if (canVisitPost) {
        result = callback(result, node, key, ctx)
      }

      return result
    }

    return rec(init, node, "", initialContext)
  }
