import { it, expect } from "vitest"
import { TreeOfStrings } from "./__testutils__/index.ts"
import { NodeType, TraversalType } from "../types.ts"

const filter = TreeOfStrings.tree.filter

it("should return empty when root node is filtered out", () => {
  expect(filter((x) => !x, "root")).toEqual(undefined)
  expect(filter((x) => !x, {})).toEqual(undefined)
})

it("should return root node when root node is not filtered out", () => {
  expect(filter((x) => x, "root")).toEqual("root")
  expect(filter((x) => x, {})).toEqual({})
})

it("should return empty object when all leafs are filtered out", () => {
  expect(filter((x) => !x, { a: "a" }, { visit: NodeType.Leaf })).toEqual({})
})

it("should filter out nested collection before traversing into it", () => {
  const result = filter((x) => !(x instanceof Array), { a: "a", b: ["a", "b"] })
  expect(result).toEqual({ a: "a" })
})

it("should filter out value inside nested collection", () => {
  const result = filter((x) => x !== "b", { a: "a", b: ["a", "b"] })
  expect(result).toEqual({ a: "a", b: ["a"] })
})

it("should filter out empty values and collections in post-order traversal", () => {
  const result = filter(
    (x) => x !== "b" && !(x instanceof Array && x.length === 0),
    { a: "a", b: ["b", "b"] },
    { traversal: TraversalType.PostOrder }
  )
  expect(result).toEqual({ a: "a" })
})

it("should filter out empty values and leave empty collections in pre-order traversal", () => {
  const result = filter(
    (x) => x !== "b" && !(x instanceof Array && x.length === 0),
    { a: "a", b: ["b", "b"] },
    { traversal: TraversalType.PreOrder }
  )
  expect(result).toEqual({ a: "a", b: [] })
})
