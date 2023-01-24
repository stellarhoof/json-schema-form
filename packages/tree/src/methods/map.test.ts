import { it, expect } from "vitest"
import isPlainObject from "lodash/isPlainObject.js"
import { Key } from "../types.ts"
import {
  testCases,
  TreeOfStrings,
  TreeOfCollections,
} from "./__testutils__/index.ts"

const callback = (node) => {
  if (typeof node === "string") return `${node} added[string]`
  if (node instanceof Array) return [...node, "added[array]"]
  if (isPlainObject(node)) return { ...node, key: "added[object]" }
  return node
}

it.each(testCases)(
  "tree:TreeOfStrings visit:$visit traversal:$traversal",
  (options) => {
    const { tree, getValue } = TreeOfStrings
    const result = tree.map(callback, getValue(), options)
    expect(result).toMatchSnapshot()
  }
)

it.each(testCases)(
  "tree:TreeOfCollections visit:$visit traversal:$traversal",
  (options) => {
    const { tree, getValue } = TreeOfCollections
    const result = tree.map(callback, getValue(), options)
    expect(result).toMatchSnapshot()
  }
)

it("should not keep traversing when children are dynamically removed", () => {
  const { tree, getValue } = TreeOfCollections
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
  const { tree, getValue } = TreeOfCollections
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
