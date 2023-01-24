import iteratee from "lodash/iteratee.js"
import { Key, Iteratee, Context, Config, TraversalOptions } from "../types.ts"
import { resolveOptions, nextContext, initialContext } from "./util.ts"

type CallbackFn<Node> = (node: Node, key: Key, ctx: Context<Node>) => boolean

export type Callback<Node> = Iteratee<CallbackFn<Node>>

export const filter =
  <Node, Children>(config: Config<Node, Children>) =>
  (
    callback: Callback<Node>,
    node: Node,
    options?: Partial<TraversalOptions>
  ): Node | undefined => {
    const predicate = iteratee(callback)

    const rec = (...[node, key, ctx]: Parameters<CallbackFn<Node>>) => {
      const children = config.getChildren(node)

      const { canVisitPre, canVisitPost } = resolveOptions(children, options)

      if (canVisitPre && !predicate(node, key, ctx)) {
        return undefined
      }

      if (children) {
        const mapped = config.mapChildren<Node | undefined, Children>(
          (...args) => rec(...args, nextContext(node, key, ctx)),
          children
        )
        const filtered = config.filterChildren(
          (node) => node !== undefined,
          mapped
        )
        node = config.setChildren(filtered, node)
      }

      if (canVisitPost && !predicate(node, key, ctx)) {
        return undefined
      }

      return node
    }

    return rec(node, "", initialContext)
  }
