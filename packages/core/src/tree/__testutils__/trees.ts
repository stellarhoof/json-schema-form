import isPlainObject from "lodash/isPlainObject.js"
import { Key, Collection } from "../util/collection.js"
import { Tree } from "../index.js"

export namespace SimpleTree {
  export const name = "SimpleTree"

  type T = any

  export const tree = new Tree<T>()

  export const getValue = (): T => ({
    title: "The Empire Strikes Back",
    planets: ["Aldeeran", { name: "Tatooine" }],
  })
}

export namespace TreeWithChildrenKey {
  export const name = "TreeWithChildrenKey"

  interface T extends Record<Key, any> {
    [index: Key]: undefined | string | Collection<T>
    children?: Collection<T>
  }

  export const tree = new Tree<T>({
    getChildren(node) {
      if (isPlainObject(node) && "children" in node) {
        return node.children
      }
    },
    setChildren(children, node) {
      return { ...node, children }
    },
  })

  export const getValue = (): T => ({
    name: "Anakin Skywalker",
    children: [{ name: "Luke Skywalker", films: [{ title: "A New Hope" }] }],
  })
}
