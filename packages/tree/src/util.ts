import reverse from "lodash/reverse.js"
import dropRight from "lodash/dropRight.js"
import isPlainObject from "lodash/isPlainObject.js"
import { Key, Context, Config } from "./types.ts"

export const buildPath = <Node>(_node: Node, key: Key, ctx: Context<Node>) =>
  reverse([key, ...dropRight(ctx.parentsKeys)])

export const foo = <Node extends Record<Key, any>, Children>(
  key: Key
): Pick<Config<Node, Children>, "getChildren" | "setChildren"> => ({
  getChildren(node) {
    if (isPlainObject(node) && key in node) {
      return (node as Node)[key] as Children
    }
  },
  setChildren(children, node) {
    return {
      ...node,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      [key]: children,
    }
  },
})
