import { it, expect } from "vitest"
import { Key } from "./util/collection.js"
import { testCases } from "./__testutils__/util.js"
import { TreeWithChildrenKey } from "./__testutils__/trees.js"

const accumulateArgs = (acc) => (node, key, context) => {
  acc.push({ node, key, context })
}

it.each(testCases)(
  "tree:$name visit:$options.visit traversal:$options.traversal",
  ({ tree, getValue, options }) => {
    const args: any[] = []
    tree.forEach(accumulateArgs(args), getValue(), options)
    expect(args).toMatchSnapshot()
  }
)

it("should not keep traversing when children are dynamically removed", () => {
  const { tree, getValue } = TreeWithChildrenKey
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
  const { tree, getValue } = TreeWithChildrenKey
  const keys: Key[] = []
  tree.forEach((node, key) => {
    keys.push(key)
    if (key === "") {
      node.children = { added: { Aria: "Stark" } }
    }
  }, getValue())
  expect(keys).toEqual(["", "added"])
})
