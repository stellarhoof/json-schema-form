import { describe, it, expect } from "vitest"
import { SimpleTree, TreeWithChildrenKey } from "./__testutils__/trees.js"

describe("SimpleTree find()/findPath()", () => {
  it("should return nested node/path given function predicate", () => {
    const { tree, getValue } = SimpleTree
    const predicate = (node, key) => key === "Samba"

    const node = tree.find(predicate, getValue())
    expect(node).toEqual(["value"])

    const path = tree.findPath(predicate, getValue())
    expect(path).toEqual(["Snow", "Samba"])
  })
})

describe("TreeWithChildrenKey find()/findPath()", () => {
  it("should return undefined given no node found", () => {
    const { tree, getValue } = TreeWithChildrenKey
    const predicate = () => false

    const node = tree.find(predicate, getValue())
    expect(node).toEqual(undefined)

    const path = tree.findPath(predicate, getValue())
    expect(path).toEqual(undefined)
  })

  it("should find nested node/path given function predicate", () => {
    const { tree, getValue } = TreeWithChildrenKey
    const predicate = (node) => node.Samba === "value"

    const node = tree.find(predicate, getValue())
    expect(node).toEqual({ Samba: "value" })

    const path = tree.findPath(predicate, getValue())
    expect(path).toEqual(["Second"])
  })

  it("should find nested node/path given object predicate", () => {
    const { tree, getValue } = TreeWithChildrenKey
    const predicate = { Samba: "value" }

    const node = tree.find(predicate, getValue())
    expect(node).toEqual({ Samba: "value" })

    const path = tree.findPath(predicate, getValue())
    expect(path).toEqual(["Second"])
  })
})
