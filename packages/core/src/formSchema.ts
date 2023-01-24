import _ from "lodash/fp.js"
import convert from "lodash/fp/convert.js"
import F from "futil"
import { extendObservable, observable, toJS } from "mobx"
import { joinPaths } from "./util.js"
import { getSchemaValue } from "./jsonSchema.js"
import type { FormSchema, ArrayFormSchema, ObjectFormSchema } from "./types.js"

const mut = convert({ immutable: false })

const formTree = F.tree(
  (schema: FormSchema) =>
    ("properties" in schema && schema.properties) ||
    ("items" in schema && schema.field.items)
)

export const reduceSchema = _.curryN(2, (fn: Function, schema: FormSchema) =>
  formTree.reduce((acc: Record<string, any>, schema: FormSchema) => {
    const result = fn(schema)
    if (result !== undefined) acc[schema.field.path] = result
    return acc
  })({}, schema)
)

export const toJsonSchema = (schema: FormSchema) => {
  schema = toJS(schema)
  formTree.walk((schema: FormSchema) => {
    delete (schema as any).field
    delete (schema as any).items?.field
  })(schema)
  return schema
}

const addGenericProperties = (
  schema: FormSchema,
  value?: any,
  validate?: Function
) => {
  extendObservable(schema.field, {
    __disabled: !!schema.readOnly,
    get path() {
      return joinPaths(
        schema.field.parentSchema?.field?.path,
        schema.field.name
      )
    },
    get value() {
      return _.get(joinPaths("__root__", schema.field.path), value)
    },
    set value(x) {
      mut.set(joinPaths("__root__", schema.field.path), x, value)
    },
    get formData() {
      const data = new FormData()
      formTree.walk((schema: FormSchema) => {
        if (
          !schema.field.disabled &&
          !("items" in schema) &&
          !("properties" in schema)
        ) {
          data.append(schema.field.path, schema.field.value)
        }
      })(schema)
      return data
    },
    get required() {
      if (
        schema.field.willValidate &&
        schema.field.parentSchema?.type === "object"
      ) {
        const parent = schema.field.parentSchema as ObjectFormSchema
        const name = schema.field.name as string
        return (parent.required ?? []).includes(name)
      }
      return false
    },
    set required(value) {
      if (schema.field.parentSchema?.type === "object") {
        const parent = schema.field.parentSchema as ObjectFormSchema
        const name = schema.field.name as string
        const fn = value ? _.union : _.difference
        parent.required = fn(parent.required, [name])
      }
    },
    get disabled() {
      // The `disabled` state should "stack", e.g. if two parents are
      // `disabled`, only by clearing them both can this field be enabled again
      // (assumming this field itself is not `disabled`).
      return (
        schema.field.parentSchema?.field?.disabled || schema.field.__disabled
      )
    },
    set disabled(x: boolean) {
      schema.field.__disabled = x
    },
    get willValidate() {
      return (
        !schema.field.readonly && !schema.field.hidden && !schema.field.disabled
      )
    },
    get validationMessage() {
      return schema.field.willValidate ? schema.field.__validationMessage : ""
    },
    setCustomValidity(message: string) {
      schema.field.__validationMessage = message
    },
    checkValidity() {
      return _.isEmpty(validate?.(schema))
    },
    reportValidity() {
      const errors = _.mapKeys(
        (k) => joinPaths(schema.field.path, k),
        // Validating a single property from a general schema is not possible in
        // the general case and it's complex in relatively simple cases
        // https://github.com/ajv-validator/ajv/issues/211#issuecomment-242997557
        validate?.(schema)
      )
      formTree.walk((schema: FormSchema) => {
        schema.field.setCustomValidity(errors[schema.field.path])
      })(schema)
      return _.isEmpty(errors)
    },
  })
}

const getSchemaItem = (
  schema: ArrayFormSchema,
  index: number,
  addFieldsToSchema: AddFieldsToSchema
) => {
  const item = toJS(schema.items)
  addFieldsToSchema(item as FormSchema, schema, index)
  return item
}

const addArrayProperties = (
  schema: ArrayFormSchema,
  addFieldsToSchema: AddFieldsToSchema
) => {
  extendObservable(schema.field, {
    items: _.times(
      (index) => getSchemaItem(schema, index, addFieldsToSchema),
      _.size(schema.field.value)
    ),
    get canAddItem() {
      return (schema.maxItems ?? -1) < schema.field.value?.length
    },
    get canRemoveItem() {
      return (schema.minItems ?? Infinity) >= _.size(schema.field.value)
    },
    addItem(index?: number) {
      index ||= _.size(schema.field.value)
      const item = getSchemaItem(schema, index, addFieldsToSchema)
      const value = getSchemaValue(schema.items)
      schema.field.items.splice(index, 0, item)
      schema.field.value.splice(index, 0, value)
      // Adjust names (indexes) of items, as they're now off by one
      for (const item of schema.field.items.slice(index + 1))
        (item.field.name as number)++
    },
    removeItem(index?: number) {
      index ||= _.size(schema.field.value)
      schema.field.items.splice(index, 1)
      schema.field.value.splice(index, 1)
      // Adjust names (indexes) of items, as they're now off by one
      for (const item of schema.field.items.slice(index))
        (item.field.name as number)--
    },
  })
}

const addObjectProperties = (
  schema: ObjectFormSchema,
  addFieldsToSchema: AddFieldsToSchema
) => {
  for (const [name, child] of _.toPairs(schema.properties ?? {})) {
    addFieldsToSchema(child, schema, name)
  }
}

interface Config {
  value?: any
  validate?: Function
  onFieldAdd?: Function
}

type AddFieldsToSchema = (
  schema: FormSchema,
  parentSchema?: FormSchema,
  name?: string | number
) => void

export const fromJsonSchema = (schema: FormSchema, config: Config = {}) => {
  schema = observable(schema)
  const value = observable(
    getSchemaValue(schema, { __root__: config.value }, "__root__")
  )
  const addFieldsToSchema: AddFieldsToSchema = (
    schema,
    parentSchema,
    name = ""
  ) => {
    if (!schema.field) extendObservable(schema, { field: {} })
    // Extend the field with some useful properties but do not make these
    // properties observable
    extendObservable(
      schema.field,
      { name, schema, parentSchema },
      { name: false, schema: false, parentSchema: false }
    )
    addGenericProperties(schema, value, config?.validate)
    if (schema.type === "array")
      addArrayProperties(schema as ArrayFormSchema, addFieldsToSchema)
    if (schema.type === "object")
      addObjectProperties(schema as ObjectFormSchema, addFieldsToSchema)
    config?.onFieldAdd?.(schema)
  }
  addFieldsToSchema(schema)
  return schema
}
