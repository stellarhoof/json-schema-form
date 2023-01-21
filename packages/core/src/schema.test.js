import { describe, it, expect } from "vitest"
import { getSchemaValue, extractSubschema } from "./schema.js"

describe("getSchemaValue()", () => {
  const scalar = [
    [
      "should use empty",
      {
        schema: {
          type: "string",
        },
        result: "",
      },
    ],
    [
      "should use default",
      {
        schema: {
          default: "John",
        },
        result: "John",
      },
    ],
    [
      "should use default instead of empty",
      {
        schema: {
          type: "string",
          default: "John",
        },
        result: "John",
      },
    ],
  ]

  const object = [
    [
      "should not replace property in parent's default with empty value when parent's default has the correct type",
      {
        schema: {
          type: "object",
          default: { name: "John" },
          properties: { name: { type: "string" } },
        },
        result: { name: "John" },
      },
    ],
    [
      "should not replace property in parent's default with child's default value when parent's default has the correct type",
      {
        schema: {
          type: "object",
          default: { name: "John" },
          properties: {
            name: { type: "string", default: "Sally" },
          },
        },
        result: { name: "John" },
      },
    ],
    [
      "should replace property in parent's default with empty value when parent's default has the wrong type",
      {
        schema: {
          type: "object",
          default: { name: 1 },
          properties: {
            name: { type: "string" },
          },
        },
        result: { name: "" },
      },
    ],
    [
      "should replace property in parent's default with default value when parent's default has the wrong type",
      {
        schema: {
          type: "object",
          default: { name: 1 },
          properties: {
            name: { default: "John" },
          },
        },
        result: { name: "John" },
      },
    ],
    [
      "should set property in parent when parent has no default",
      {
        schema: {
          type: "object",
          properties: {
            name: { default: "John" },
          },
        },
        result: { name: "John" },
      },
    ],
  ]

  const array = [
    [
      "should use empty array",
      {
        schema: {
          type: "array",
          items: {},
        },
        result: [],
      },
    ],
    [
      "should use default array",
      {
        schema: {
          type: "array",
          default: ["John"],
          items: {},
        },
        result: ["John"],
      },
    ],
    [
      "should not replace scalar in parent's default with empty value",
      {
        schema: {
          type: "array",
          default: ["John"],
          items: { type: "string" },
        },
        result: ["John"],
      },
    ],
    [
      "should not replace scalar in parent's default with default value",
      {
        schema: {
          type: "array",
          default: ["John"],
          items: { type: "string", default: "Sally" },
        },
        result: ["John"],
      },
    ],
    [
      "should not replace object property in parent's default with default value",
      {
        schema: {
          type: "array",
          default: [{ name: "John" }],
          items: {
            type: "object",
            properties: {
              name: { type: "string", default: "Sally" },
            },
          },
        },
        result: [{ name: "John" }],
      },
    ],
    [
      "should replace object property in parent's default with empty value",
      {
        schema: {
          type: "array",
          default: [{}],
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
          },
        },
        result: [{ name: "" }],
      },
    ],
    [
      "should replace object property in parent's default with default value",
      {
        schema: {
          type: "array",
          default: [{}],
          items: {
            type: "object",
            properties: {
              name: { type: "string", default: "Sally" },
            },
          },
        },
        result: [{ name: "Sally" }],
      },
    ],
  ]

  it.each(scalar)("scalar: %s", (name, { schema, result }) => {
    expect(getSchemaValue(schema)).toEqual(result)
  })

  it.each(object)("object: %s", (name, { schema, result }) => {
    expect(getSchemaValue(schema)).toEqual(result)
  })

  it.each(array)("array: %s", (name, { schema, result }) => {
    expect(getSchemaValue(schema)).toEqual(result)
  })
})

describe.skip("extractSubschema()", () => {
  it("should omit required blacklisted field", () => {
    const schema = {
      type: "object",
      required: ["a", "b"],
      properties: { a: { type: "string" }, b: { type: "string" } },
    }
    const result = {
      type: "object",
      required: ["a"],
      properties: { a: { type: "string" } },
    }
    expect(extractSubschema(["/a"], schema)).toEqual(result)
  })
})
