import isPlainObject from "lodash/isPlainObject.js"

export type Key = string | number | symbol

export type Collection<T> = Array<T> | Record<Key, T>

export const forEach = <T>(
  callback: (child: T, key: Key) => void,
  children: Collection<T>
): void => {
  if (children instanceof Array) {
    children.forEach((v, k) => callback(v, k))
  }
  if (isPlainObject(children)) {
    for (const key in children) {
      callback(children[key], key)
    }
  }
}

export const map = <T, T2 = any>(
  callback: (child: T, key: Key) => T2,
  children: Collection<T> | any
): Collection<T2> | [] => {
  if (children instanceof Array) {
    return children.map((v, k) => callback(v, k))
  }
  if (isPlainObject(children)) {
    const result: Collection<T2> = {}
    for (const key in children) {
      result[key] = callback(children[key], key)
    }
    return result
  }
  return []
}

export const filter = <T>(
  callback: (child: T, key: Key) => boolean,
  children: Collection<T> | any
): Collection<T> | [] => {
  if (children instanceof Array) {
    return children.filter((v, k) => callback(v, k))
  }
  if (isPlainObject(children)) {
    const result: Collection<T> = {}
    for (const key in children) {
      if (callback(children[key], key)) {
        result[key] = children[key]
      }
    }
    return result
  }
  return []
}
