import iteratee from "lodash/iteratee.js"
import { Key, Context, Config, TraversalOptions } from "../types.ts"
import { findResult } from "./findResult.ts"

export type Callback<Node> = (
  node: Node,
  key: Key,
  ctx: Context<Node>
) => boolean

export const find =
  <Node, Children>(config: Config<Node, Children>) =>
  (
    callback: Callback<Node>,
    node: Node,
    options?: Partial<TraversalOptions>
  ) => {
    const predicate = iteratee(callback)
    return findResult(config)(
      (node, ...args) => (predicate(node, ...args) ? node : undefined),
      node,
      options
    )
  }
