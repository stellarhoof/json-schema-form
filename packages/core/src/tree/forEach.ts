import * as collection from "./util/collection.js"
import {
  Options,
  Context,
  resolveOptions,
  nextContext,
  initialContext,
} from "./util/traversal.js"

type ForEachCallback<T> = (
  node: T,
  key: collection.Key,
  context: Context<T>
) => void

export const forEach = <T = any>(
  callback: ForEachCallback<T>,
  node: T,
  options?: Partial<Options<T>>
): void => {
  const rec: ForEachCallback<T> = (node, key, context) => {
    const { getChildren, canVisitPre, canVisitPost } = resolveOptions(
      node,
      options
    )

    if (canVisitPre) {
      callback(node, key, context)
    }

    // Get fresh children since the pre-order callback can mutate node such that
    // `getChildren(node)` returns a different result
    const children = getChildren(node)

    if (children) {
      collection.forEach<T>((...args) => {
        rec(...args, nextContext(node, key, context))
      }, children)
    }

    if (canVisitPost) {
      callback(node, key, context)
    }
  }

  rec(node, "", initialContext)
}
