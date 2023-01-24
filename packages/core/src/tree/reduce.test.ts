import { it, expect } from "vitest"
import { testCases } from "./__testutils__/util.js"

const accumulateArgs = (acc, node, key, context) => {
  return [...acc, { node, key, context }]
}

it.each(testCases)(
  "tree:$name visit:$options.visit traversal:$options.traversal",
  ({ tree, getValue, options }) => {
    const acc = tree.reduce(accumulateArgs, getValue(), [], options)
    expect(acc).toMatchSnapshot()
  }
)
