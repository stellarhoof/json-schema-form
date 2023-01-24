import _ from "lodash/fp.js"
import { PropertyPath } from "lodash"
import F from "futil"
import { joinPaths } from "./util.js"

export interface BaseJsonSchema {
  type: "boolean" | "number" | "string" | "null" | "array" | "object"
  default?: any
  readOnly?: boolean
}

export interface ArrayJsonSchema extends BaseJsonSchema {
  type: "array"
  items: JsonSchema
  default?: any[]
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
}

export interface ObjectJsonSchema extends BaseJsonSchema {
  type: "object"
  required?: string[]
  default?: Record<string, any>
  properties?: Record<string, JsonSchema>
  additionalProperties?: boolean
}

export type JsonSchema = BaseJsonSchema | ArrayJsonSchema | ObjectJsonSchema

const empty: Record<string, any> = {
  null: null,
  number: 0,
  integer: 0,
  boolean: false,
  string: "",
  array: [],
  object: {},
}

const jsonSchemaType = (value: any) => {
  if (_.isArray(value)) return "array"
  if (_.isNull(value)) return "null"
  return typeof value
}

/**
 * Inspired by https://github.com/sagold/json-schema-library#gettemplate
 */
export const getSchemaValue = (
  schema: JsonSchema,
  value?: any,
  path?: string,
  acc?: any
) => {
  acc ||= _.cloneDeep(value ?? schema.default ?? empty[schema.type])

  let current = _.get(path as PropertyPath, acc)

  if (!_.isEqual(schema.type, jsonSchemaType(current))) {
    current = _.cloneDeep(schema.default ?? empty[schema.type])
    if (!_.isUndefined(current) && !_.isUndefined(path))
      F.setOn(path, current, acc)
  }

  if ("properties" in schema)
    F.eachIndexed(
      (property: JsonSchema, name: string) =>
        getSchemaValue(property, value, joinPaths(path, name), acc),
      schema.properties
    )

  if ("items" in schema) {
    _.times(
      (index) =>
        getSchemaValue(schema.items, value, joinPaths(path, index), acc),
      _.size(_.isArray(current) ? current : [])
    )
  }

  return acc
}

// E.g. toSchemaPath('foo.bar') => '/properties/foo/properties/bar'
export const dottedPathToSchemaPath = (x: string) => {
  const path = x
    .replaceAll(/\d+/g, "items")
    .replaceAll(".items", "/items")
    .replaceAll(".", "/properties/")
  return path.startsWith("items") ? path : `/properties/${path}`
}

// // TODO
// export const extractSubschema = (whitelist, schema) => {
//   // const byPointer = _.fromPairs()
//   return F.reduceTree((x) => x.properties)({}, schema)
// }
