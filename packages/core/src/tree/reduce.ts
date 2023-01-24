import * as collection from "./util/collection.js"
import {
  Options,
  Context,
  resolveOptions,
  nextContext,
  initialContext,
} from "./util/traversal.js"

export type ReduceCallback<A, T> = (
  acc: A,
  node: T,
  key: collection.Key,
  context: Context<T>
) => A

export const reduce = <A, T = any>(
  callback: ReduceCallback<A, T>,
  node: T,
  acc: A,
  options?: Partial<Options<T>>
): A => {
  const rec: ReduceCallback<A, T> = (acc, node, key, context) => {
    const { children, canVisitPre, canVisitPost } = resolveOptions(
      node,
      options
    )

    if (canVisitPre) {
      acc = callback(acc, node, key, context)
    }

    if (children) {
      collection.forEach<T>((...args) => {
        acc = rec(acc, ...args, nextContext(node, key, context))
      }, children)
    }

    if (canVisitPost) {
      acc = callback(acc, node, key, context)
    }

    return acc
  }

  return rec(acc, node, "", initialContext)
}
