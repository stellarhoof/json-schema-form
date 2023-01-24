import { it, expect } from "vitest"
import isPlainObject from "lodash/isPlainObject.js"
import { Key } from "./util/collection.js"
import { testCases } from "./__testutils__/util.js"
import { TreeWithChildrenKey } from "./__testutils__/trees.js"

const callback = (node) => {
  if (typeof node === "string") return `${node} added[string]`
  if (node instanceof Array) return [...node, "added[array]"]
  if (isPlainObject(node)) return { ...node, key: "added[object]" }
  return node
}

it.each(testCases)(
  "tree:$name visit:$options.visit traversal:$options.traversal",
  ({ tree, getValue, options }) => {
    const result = tree.map(callback, getValue(), options)
    expect(result).toMatchSnapshot()
  }
)

it("should not keep traversing when children are dynamically removed", () => {
  const { tree, getValue } = TreeWithChildrenKey
  const keys: Key[] = []

  tree.map((node, key) => {
    keys.push(key)
    if (key === "") {
      return { ...node, children: {} }
    }
  }, getValue())

  expect(keys).toEqual([""])
})

it("should keep traversing when children are dynamically added", () => {
  const { tree, getValue } = TreeWithChildrenKey
  const keys: Key[] = []

  tree.map((node, key) => {
    keys.push(key)
    if (key === "") {
      return {
        ...node,
        children: {
          related: { name: "Game of Thrones" },
        },
      }
    }
  }, getValue())

  expect(keys).toEqual(["", "related"])
})
