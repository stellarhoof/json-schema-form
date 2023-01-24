import { it, expect } from "vitest"
import {
  testCases,
  TreeOfStrings,
  TreeOfCollections,
} from "./__testutils__/index.ts"

const accumulateArgs = (acc, node, key, ctx) => {
  return [...acc, { node, key, ctx }]
}

it.each(testCases)(
  "tree:TreeOfStrings visit:$visit traversal:$traversal",
  (options) => {
    const { tree, getValue } = TreeOfStrings
    const init: { node: any; key: any; context: any }[] = []
    const result = tree.reduce(accumulateArgs, getValue(), init, options)
    expect(result).toMatchSnapshot()
  }
)

it.each(testCases)(
  "tree:TreeOfCollections visit:$visit traversal:$traversal",
  (options) => {
    const { tree, getValue } = TreeOfCollections
    const init: { node: any; key: any; context: any }[] = []
    const result = tree.reduce(accumulateArgs, getValue(), init, options)
    expect(result).toMatchSnapshot()
  }
)
