import { describe, it, expect } from "vitest"
import { TreeOfStrings, TreeOfCollections } from "./__testutils__/index.ts"

describe("TreeOfStrings find()/findPath()", () => {
  it("should return nested node/path given function predicate", () => {
    const { tree, getValue } = TreeOfStrings

    const node = tree.find((v, k) => k === "Samba", getValue())
    expect(node).toEqual(["value"])

    const path = tree.findPath((v, k) => k === "Samba", getValue())
    expect(path).toEqual(["Snow", "Samba"])
  })
})

describe("TreeOfCollections find()/findPath()", () => {
  it("should return undefined given no node found", () => {
    const { tree, getValue } = TreeOfCollections
    const predicate = () => false

    const node = tree.find(predicate, getValue())
    expect(node).toEqual(undefined)

    const path = tree.findPath(predicate, getValue())
    expect(path).toEqual(undefined)
  })

  it("should find nested node/path given function predicate", () => {
    const { tree, getValue } = TreeOfCollections

    const node = tree.find((n) => n.Samba === "value", getValue())
    expect(node).toEqual({ Samba: "value" })

    const path = tree.findPath((n) => n.Samba === "value", getValue())
    expect(path).toEqual(["Second"])
  })

  it("should find nested node/path given object predicate", () => {
    const { tree, getValue } = TreeOfCollections
    const predicate = { Samba: "value" }

    const node = tree.find(predicate, getValue())
    expect(node).toEqual({ Samba: "value" })

    const path = tree.findPath(predicate, getValue())
    expect(path).toEqual(["Second"])
  })
})
