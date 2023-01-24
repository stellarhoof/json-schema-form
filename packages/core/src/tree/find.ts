import iteratee from "lodash/iteratee.js"
import dropRight from "lodash/dropRight.js"
import reverse from "lodash/reverse.js"
import * as collection from "./util/collection.js"
import {
  Options,
  Context,
  Iteratee,
  resolveOptions,
  nextContext,
  initialContext,
} from "./util/traversal.js"

class Found extends Error {
  value: any
  constructor(value: any) {
    super("Found")
    this.value = value
  }
}

type FindCallback<T> = (
  node: T,
  key: collection.Key,
  context: Context<T>
) => any

const findAndReturn =
  <T = any>(returnFn: FindCallback<T>) =>
  (
    callback: Iteratee<FindCallback<T>>,
    node: T,
    options?: Partial<Options<T>>
  ): any => {
    const predicate = iteratee(callback)

    const rec: FindCallback<T> = (node, key, context) => {
      const { children, canVisitPre, canVisitPost } = resolveOptions(
        node,
        options
      )

      if (canVisitPre && predicate(node, key, context)) {
        throw new Found(returnFn(node, key, context))
      }

      if (children) {
        collection.forEach<T>(
          (...args) => rec(...args, nextContext(node, key, context)),
          children
        )
      }

      if (canVisitPost && predicate(node, key, context)) {
        throw new Found(returnFn(node, key, context))
      }
    }

    try {
      rec(node, "", initialContext)
    } catch (e: any) {
      if (e instanceof Found) return e.value
      throw e
    }
  }

export const find = findAndReturn(<T>(node: T) => node)

const buildPath = <T>(_node: T, key: collection.Key, context: Context<T>) =>
  reverse([key, ...dropRight(context.parentsKeys)])

export const findPath = findAndReturn(buildPath)
