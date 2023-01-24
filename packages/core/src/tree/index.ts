/*
# TODO

Tree.map<T>(fn, tree, options)
const tree = new Tree<T>(options)
tree.map(fn, tree)
tree.map(fn, tree, options)

Tree.map(...) should be the equivalent to new Tree().map(...)
Test all traversals and all visit types
Test that options get inherited if a tree instance gets built
*/

import { map } from "./map.js"
import { filter } from "./filter.js"
import { reduce, ReduceCallback } from "./reduce.js"
import { find, findPath } from "./find.js"
import { forEach } from "./forEach.js"
import { Options } from "./util/traversal.js"

export class Tree<T> {
  static map = map
  public map: typeof map<T>

  static filter = filter
  public filter: typeof filter<T>

  static forEach = forEach
  public forEach: typeof forEach<T>

  static reduce = reduce
  public reduce: <A = any>(
    callback: ReduceCallback<A, T>,
    node: T,
    acc: A,
    options?: Partial<Options<T>>
  ) => A

  static find = find
  public find: typeof find<T>

  static findPath = findPath
  public findPath: typeof findPath<T>

  constructor(options: Partial<Options<T>> = {}) {
    this.map = (callback, node, opts) =>
      map(callback, node, { ...options, ...opts })

    this.filter = (callback, node, opts) =>
      filter(callback, node, { ...options, ...opts })

    this.forEach = (callback, node, opts) =>
      forEach(callback, node, { ...options, ...opts })

    this.reduce = (callback, node, acc, opts) =>
      reduce(callback, node, acc, { ...options, ...opts })

    this.find = (callback, node, opts) =>
      find(callback, node, { ...options, ...opts })

    this.findPath = (callback, node, opts) =>
      findPath(callback, node, { ...options, ...opts })
  }
}
