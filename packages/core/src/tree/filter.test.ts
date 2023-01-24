import { it, expect } from "vitest"
import { SimpleTree } from "./__testutils__/trees.js"
import { NodeType, TraversalType } from "./util/traversal.js"

const filter = SimpleTree.tree.filter

it("should return empty list when root node is filtered out", () => {
  expect(filter((x) => !x, 10)).toEqual([])
  expect(filter((x) => !x, {})).toEqual([])
})

it("should return root node when root node is not filtered out", () => {
  expect(filter((x) => x, 10)).toEqual(10)
  expect(filter((x) => x, {})).toEqual({})
})

it("should return empty object when all leafs are filtered out", () => {
  expect(filter((x) => !x, { a: 1 }, { visit: NodeType.Leaf })).toEqual({})
})

it("should filter out nested collection before traversing into it", () => {
  const result = filter((x) => !(x instanceof Array), { a: 1, b: [1, 2] })
  expect(result).toEqual({ a: 1 })
})

it("should filter out value inside nested collection", () => {
  const result = filter((x) => x !== 2, { a: 1, b: [1, 2] })
  expect(result).toEqual({ a: 1, b: [1] })
})

it("should filter out empty values and collections in post-order traversal", () => {
  const result = filter(
    (x) => x !== null && !(x instanceof Array && x.length === 0),
    { a: 1, b: [null, null] },
    { traversal: TraversalType.PostOrder }
  )
  expect(result).toEqual({ a: 1 })
})

it("should filter out empty values and leave empty collections in pre-order traversal", () => {
  const result = filter(
    (x) => x !== null && !(x instanceof Array && x.length === 0),
    { a: 1, b: [null, null] },
    { traversal: TraversalType.PreOrder }
  )
  expect(result).toEqual({ a: 1, b: [] })
})
