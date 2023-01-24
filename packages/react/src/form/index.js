import _ from "lodash/fp.js"
import Ajv from "ajv"
import { extendObservable } from "mobx"
import { toJsonSchema, fromJsonSchema } from "@json-schema-form/core"
import { removeBlankLeaves } from "../futil.js"
import { getSchemaControl } from "./controls/index.js"

const onFieldAdd = (schema) => {
  schema.field.id = _.uniqueId()

  if (
    _.isUndefined(schema.title) &&
    schema.field.parentSchema?.type !== "array"
  )
    schema.title = _.startCase(schema.field.name)

  if (!schema.field.component) {
    extendObservable(
      schema.field,
      { component: getSchemaControl(schema) },
      { component: false }
    )
  }

  if (!schema.field.component) {
    throw new Error(
      `"${schema.field.path}": no component provided and could not infer one from the schema`
    )
  }
}

const ajv = new Ajv({ strict: true, verbose: true, allErrors: true })

const getErrorPath = (e) => {
  let path = e.instancePath.replace("/", "").replaceAll("/", ".")
  if (e.keyword === "required") path = `${path}.${e.params.missingProperty}`
  return path
}

const getErrorMessage = (e) => {
  if (e.keyword === "required") return "this field is required"
  return e.message
}

const validate = (schema) => {
  ajv.validate(toJsonSchema(schema), removeBlankLeaves(schema.field.value))
  return _.flow(
    _.groupBy(getErrorPath),
    _.mapValues((errors) => errors.map(getErrorMessage).join("\n"))
  )(ajv.errors)
}

export const createFormSchema = (schema, value) =>
  fromJsonSchema(schema, { value, validate, onFieldAdd })
