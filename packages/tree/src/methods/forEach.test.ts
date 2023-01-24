import { it, expect } from "vitest"
import { Key } from "../types.ts"
import {
  testCases,
  TreeOfStrings,
  TreeOfCollections,
} from "./__testutils__/index.ts"

const accumulateArgs = (acc) => (node, key, context) => {
  acc.push({ node, key, context })
}

it.each(testCases)(
  "tree:TreeOfStrings visit:$visit traversal:$traversal",
  (options) => {
    const { tree, getValue } = TreeOfStrings
    const args: any[] = []
    tree.forEach(accumulateArgs(args), getValue(), options)
    expect(args).toMatchSnapshot()
  }
)

it.each(testCases)(
  "tree:TreeOfCollections visit:$visit traversal:$traversal",
  (options) => {
    const { tree, getValue } = TreeOfCollections
    const args: any[] = []
    tree.forEach(accumulateArgs(args), getValue(), options)
    expect(args).toMatchSnapshot()
  }
)

it("should not keep traversing when children are dynamically removed", () => {
  const { tree, getValue } = TreeOfCollections
  const keys: Key[] = []
  tree.forEach((node, key) => {
    keys.push(key)
    if (key === "") {
      delete node.children
    }
  }, getValue())
  expect(keys).toEqual([""])
})

it("should keep traversing when children are dynamically added", () => {
  const { tree, getValue } = TreeOfCollections
  const keys: Key[] = []
  tree.forEach((node, key) => {
    keys.push(key)
    if (key === "") {
      node.children = { added: { Aria: "Stark" } }
    }
  }, getValue())
  expect(keys).toEqual(["", "added"])
})
