import iteratee from "lodash/iteratee.js"
import { Key, Iteratee, Config, Context, TraversalOptions } from "../types.ts"
import { resolveOptions, nextContext, initialContext } from "./util.ts"

class Result<T> extends Error {
  value: T
  constructor(value: T) {
    super("Result")
    this.value = value
  }
}

type CallbackFn<Node, Result> = (
  node: Node,
  key: Key,
  ctx: Context<Node>
) => Result | undefined

type Callback<Node, Result> = Iteratee<CallbackFn<Node, Result>>

export const findResult =
  <Node, Children, Result>(config: Config<Node, Children>) =>
  (
    callback: Callback<Node, Result>,
    node: Node,
    options?: Partial<TraversalOptions>
  ): Result | undefined => {
    const resultFn: CallbackFn<Node, Result> = iteratee(callback)

    const rec = (...[node, key, ctx]: Parameters<typeof resultFn>) => {
      const children = config.getChildren(node)

      const { canVisitPre, canVisitPost } = resolveOptions(children, options)

      if (canVisitPre) {
        const result = resultFn(node, key, ctx)
        if (result !== undefined && result !== null) {
          throw new Result(result)
        }
      }

      if (children) {
        config.forEachChildren(
          (...args) => rec(...args, nextContext(node, key, ctx)),
          children
        )
      }

      if (canVisitPost) {
        const result = resultFn(node, key, ctx)
        if (result !== undefined && result !== null) {
          throw new Result(result)
        }
      }
    }

    try {
      rec(node, "", initialContext)
    } catch (e: any) {
      if (e instanceof Result) {
        return e.value as Result
      }
      throw e
    }
  }
