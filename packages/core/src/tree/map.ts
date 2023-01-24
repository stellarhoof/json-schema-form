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

type MapCallback<T> = (node: T, key: collection.Key, context: Context<T>) => T

export const map = <T = any>(
  callback: Iteratee<MapCallback<T>>,
  node: T,
  options?: Partial<Options<T>>
): T => {
  const it = iteratee(callback)

  const rec: MapCallback<T> = (node, key, context) => {
    const { getChildren, setChildren, canVisitPre, canVisitPost } =
      resolveOptions(node, options)

    if (canVisitPre) {
      node = it(node, key, context)
    }

    // Get fresh children since the pre-order callback can map node such that
    // `getChildren(node)` returns a different result
    const children = getChildren(node)

    if (children) {
      const mapped = collection.map<T>(
        (...args) => rec(...args, nextContext(node, key, context)),
        children
      )
      node = setChildren(mapped, node)
    }

    if (canVisitPost) {
      node = it(node, key, context)
    }

    return node
  }

  return rec(node, "", initialContext)
}
