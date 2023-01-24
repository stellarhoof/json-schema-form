import iteratee from "lodash/iteratee.js"
import { Key, Context, Config, TraversalOptions } from "../types.ts"
import { findResult } from "./findResult.ts"
import { buildPath } from "../util.ts"

export type Callback<Node> = (
  node: Node,
  key: Key,
  ctx: Context<Node>
) => boolean

export const findPath =
  <Node, Children>(config: Config<Node, Children>) =>
  (
    callback: Callback<Node>,
    node: Node,
    options?: Partial<TraversalOptions>
  ) => {
    const predicate = iteratee(callback)
    return findResult(config)(
      (node, ...args) =>
        predicate(node, ...args) ? buildPath(node, ...args) : undefined,
      node,
      options
    )
  }
