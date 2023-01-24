import isPlainObject from "lodash/isPlainObject.js"
import { Key, Config } from "./types.ts"
import { map } from "./methods/map.ts"
import { filter } from "./methods/filter.ts"
import { reduce } from "./methods/reduce.ts"
import { find } from "./methods/find.ts"
import { findPath } from "./methods/findPath.ts"
import { forEach } from "./methods/forEach.ts"

class GenericTree<Node, Children> {
  public map
  public filter
  public forEach
  public reduce
  public find
  public findPath
  constructor(config: Config<Node, Children>) {
    this.map = map(config)
    this.filter = filter(config)
    this.forEach = forEach(config)
    this.reduce = reduce(config)
    this.find = find(config)
    this.findPath = findPath(config)
  }
}

export type Collection<T> = Array<T> | Record<Key, T>

// Collection Tree
export class Tree<Node> extends GenericTree<Node, Collection<Node>> {
  constructor({
    getChildren = (node) => {
      if (node instanceof Array || isPlainObject(node)) {
        return node as unknown as Collection<Node>
      }
    },
    setChildren = (children) => {
      return children as Node
    },
    // @ts-ignore
    mapChildren = (
      callback,
      children
    ): Collection<ReturnType<typeof callback>> => {
      if (children instanceof Array) {
        return children.map((v, k) => callback(v, k))
      }
      if (isPlainObject(children)) {
        const result: Record<Key, ReturnType<typeof callback>> = {}
        for (const key in children) {
          result[key] = callback(children[key], key)
        }
        return result
      }
      throw new TypeError("children is neither array nor object")
    },
    filterChildren = (callback, children) => {
      if (children instanceof Array) {
        return children.filter((v, k) => callback(v, k))
      }
      if (isPlainObject(children)) {
        const result: Record<Key, Node> = {}
        for (const key in children) {
          if (callback(children[key], key)) {
            result[key] = children[key]
          }
        }
        return result
      }
      throw new TypeError("children is neither array nor object")
    },
    forEachChildren = (callback, children) => {
      if (children instanceof Array) {
        children.forEach((v, k) => callback(v, k))
      }
      if (isPlainObject(children)) {
        for (const key in children) {
          callback(children[key], key)
        }
      }
      throw new TypeError("children is neither array nor object")
    },
  }: Partial<Config<Node, Collection<Node>>> = {}) {
    super({
      getChildren,
      setChildren,
      mapChildren,
      forEachChildren,
      filterChildren,
    })
  }
}
