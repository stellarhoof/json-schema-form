# Typescript dual packages nightmare

https://github.com/microsoft/TypeScript/issues/50466

# TODO

- Support for `dependentRequired`, `dependentSchemas`
- Schema helpers
- Have the option to forego wrapping an object in a field control

# Notes

This library replaces native [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation)

- Set `noValidate` on `form`
- Do not set [validation attributes](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation#validation-related_attributes) on controls

In practice a form schema will be different from a collection schema:

- Collection schemas are immutable, whereas form schemas are mutable
- Form schemas may be a subset of collection schema. Ex: email/name/password
  fields from a user collection.
- Form schemas may be a composition of different collection schemas. Ex: export
  fields + saved search fields
- Form schemas may have fields that are not present in any collection schema and
  that are used to do computation at submit time.
- Fields in form schemas may have dependencies among themselves that were not
  present in the collection schemas and viceversa
- Fields in the collection schemas may have dependencies among themselves that
  do not make sense in the form schema
- Fields in the collection schemas may be overriden in the form schema

# Extract subschema

Make a util to extract a subschema based off fields to omit/pick

- Use JSON pointers for pick/omit keys. Users can make a util to shorten the
  json pointers if they want.
- Schema should be normalized (disallow `$refs` and `$defs`)
- Recurse into schema composition keywords `allOf`, `anyOf`, `oneOf`, and `not`
- Recurse into subschema application keywords `dependentRequired`, `dependentSchemas`, and `if-then-else`

- schema overrides (json-schema vocabulary). mutable store
- schema overrides (ui vocabulary). mutable store
- field state. mutable store
- value. mutable store

# AJV Keywords

- `validate(schema, data)`: Validation time. Should return a boolean.
- `code(context)`: Compilation time. It generates code string that gets evaluated.
- `compile(schema, parentSchema, context)`: Compilation time. Should return a validation function that behaves just like `validate`
- `macro(schema, parentSchema, context)`: Compilation time. Should return a schema that will extend the current schema. It does not override the current schema.

`useDefaults` and `coerceTypes` use code generation so once the validation code has been generated we cannot change its behavior, like for example, changing ajv options to turn on/off coercing

Add a keyword with `compile` fn that is able to turn pick up the `useDefaults` flag

# AJV Schema compilation options

Global overrides on backend schemas are always applied. Computed properties such as user metrics should be marked readOnly. All listed options should remove readOnly properties from schema

1. Compile schema at the app level
2. Compile schema at the form level
   - Can pre-process the schema with further overrides, omit/pick etc...
3. Compile schema at the form level for casting/defaults and every time it's validated

- Potentially useful keywords

* [dynamicDefaults](https://ajv.js.org/packages/ajv-keywords.html#dynamicdefaults)
* [instanceof](https://ajv.js.org/packages/ajv-keywords.html#instanceof)
* [regexp](https://ajv.js.org/packages/ajv-keywords.html#regexp)
  - Only for strings
* [transform](https://ajv.js.org/packages/ajv-keywords.html#transform)
  - Only for strings
  - toEnumCase looks interesting
