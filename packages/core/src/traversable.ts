import isPlainObject from "lodash/isPlainObject.js"

export type Traversable = Iterable<any> | Record<string | number, any>

export const isNativeTraversable = (x: any): boolean =>
  x instanceof Array || x instanceof Set || x instanceof Map

export const isIterableObject = (x: any): boolean =>
  x instanceof Object &&
  Symbol.iterator in x &&
  typeof x[Symbol.iterator] === "function"

export const isTraversable = (x: any) =>
  isNativeTraversable(x) || isIterableObject(x) || isPlainObject(x)

export const each = (
  fn: (v: any, k?: string | number | symbol) => void,
  it?: any
) => {
  if (isNativeTraversable(it)) {
    it.forEach(fn)
    return
  }
  if (isIterableObject(it)) {
    for (const v of it as Iterable<any>) {
      fn(v, undefined)
    }
    return
  }
  if (isPlainObject(it)) {
    Object.entries(it as Object).forEach(([k, v]) => fn(v, k))
    return
  }
  throw new TypeError("Supported traversables are Array | Object | Map | Set")
}

export const map = (
  fn: (v: any, k?: string | number | symbol) => any,
  it?: Traversable
): Traversable => {
  if (it instanceof Array) {
    return it.map(fn)
  }
  if (it instanceof Set) {
    const result: Set<any> = new Set()
    it.forEach((v, k) => result.add(fn(v, k)))
    return result
  }
  if (it instanceof Map) {
    const result: Map<any, any> = new Map()
    it.forEach((v, k) => result.set(k, fn(v, k)))
    return result
  }
  if (isPlainObject(it)) {
    return Object.fromEntries(
      Object.entries(it as Object).map(([k, v]) => [k, fn(v, k)])
    )
  }
  throw new TypeError("Supported traversables are Array | Object | Map | Set")
}
