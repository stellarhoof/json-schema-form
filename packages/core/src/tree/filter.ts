import iteratee from "lodash/iteratee.js"
import * as collection from "./util/collection.js"
import {
  Options,
  Context,
  Iteratee,
  resolveOptions,
  nextContext,
  initialContext,
} from "./util/traversal.js"

type FilterCallback<T> = (
  node: T,
  key: collection.Key,
  context: Context<T>
) => boolean | void

export const filter = <T = any>(
  callback: Iteratee<FilterCallback<T>>,
  node: T,
  options?: Partial<Options<T>>
): T | [] => {
  const predicate = iteratee(callback)

  const rec = (
    node: T,
    key: collection.Key,
    context: Context<T>
  ): T | undefined => {
    const { children, setChildren, canVisitPre, canVisitPost } = resolveOptions(
      node,
      options
    )

    if (canVisitPre && !predicate(node, key, context)) {
      return undefined
    }

    if (children) {
      const mapped = collection.map<T>(
        (...args) => rec(...args, nextContext(node, key, context)),
        children
      )
      const filtered = collection.filter<T>(
        (node) => node !== undefined,
        mapped
      )
      node = setChildren(filtered, node)
    }

    if (canVisitPost && !predicate(node, key, context)) {
      return undefined
    }

    return node
  }

  const result = rec(node, "", initialContext)

  return result === undefined ? [] : result
}
