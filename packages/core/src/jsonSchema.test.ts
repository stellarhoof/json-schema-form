import { describe, it, expect } from "vitest"
import {
  JsonSchema,
  getSchemaValue,
  // TODO
  // extractSubschema
} from "./jsonSchema.js"

describe("getSchemaValue()", () => {
  type TestArgs = {
    testName: string
    schema: JsonSchema
    result: any
  }[]

  const scalar: TestArgs = [
    {
      testName: "should use empty",
      schema: {
        type: "string",
      },
      result: "",
    },
    {
      testName: "should use default",
      schema: {
        type: "string",
        default: "John",
      },
      result: "John",
    },
  ]

  const object: TestArgs = [
    {
      testName:
        "should not replace property in parent's default with empty value when parent's default has the correct type",
      schema: {
        type: "object",
        default: { testName: "John" },
        properties: { testName: { type: "string" } },
      },
      result: { testName: "John" },
    },
    {
      testName:
        "should not replace property in parent's default with child's default value when parent's default has the correct type",
      schema: {
        type: "object",
        default: { testName: "John" },
        properties: {
          testName: { type: "string", default: "Sally" },
        },
      },
      result: { testName: "John" },
    },
    {
      testName:
        "should replace property in parent's default with empty value when parent's default has the wrong type",
      schema: {
        type: "object",
        default: { testName: 1 },
        properties: {
          testName: { type: "string" },
        },
      },
      result: { testName: "" },
    },
    {
      testName:
        "should replace property in parent's default with default value when parent's default has the wrong type",
      schema: {
        type: "object",
        default: { testName: 1 },
        properties: {
          testName: { type: "string", default: "John" },
        },
      },
      result: { testName: "John" },
    },
    {
      testName: "should set property in parent when parent has no default",
      schema: {
        type: "object",
        properties: {
          testName: { type: "string", default: "John" },
        },
      },
      result: { testName: "John" },
    },
  ]

  const array: TestArgs = [
    {
      testName: "should use empty array",
      schema: {
        type: "array",
        items: { type: "string" },
      },
      result: [],
    },
    {
      testName:
        "should not replace scalar in parent's default with empty value",
      schema: {
        type: "array",
        default: ["John"],
        items: { type: "string" },
      },
      result: ["John"],
    },
    {
      testName:
        "should not replace scalar in parent's default with default value",
      schema: {
        type: "array",
        default: ["John"],
        items: { type: "string", default: "Sally" },
      },
      result: ["John"],
    },
    {
      testName:
        "should not replace object property in parent's default with default value",
      schema: {
        type: "array",
        default: [{ testName: "John" }],
        items: {
          type: "object",
          properties: {
            testName: { type: "string", default: "Sally" },
          },
        },
      },
      result: [{ testName: "John" }],
    },
    {
      testName:
        "should replace object property in parent's default with empty value",
      schema: {
        type: "array",
        default: [{}],
        items: {
          type: "object",
          properties: {
            testName: { type: "string" },
          },
        },
      },
      result: [{ testName: "" }],
    },
    {
      testName:
        "should replace object property in parent's default with default value",
      schema: {
        type: "array",
        default: [{}],
        items: {
          type: "object",
          properties: {
            testName: { type: "string", default: "Sally" },
          },
        },
      },
      result: [{ testName: "Sally" }],
    },
  ]

  it.each(scalar)("scalar: $testName", ({ schema, result }) => {
    expect(getSchemaValue(schema)).toEqual(result)
  })

  it.each(object)("object: $testName", ({ schema, result }) => {
    expect(getSchemaValue(schema)).toEqual(result)
  })

  it.each(array)("array: $testName", ({ schema, result }) => {
    expect(getSchemaValue(schema)).toEqual(result)
  })
})

// describe.skip("extractSubschema()", () => {
//   it("should omit required blacklisted field", () => {
//     const schema = {
//       type: "object",
//       required: ["a", "b"],
//       properties: { a: { type: "string" }, b: { type: "string" } },
//     }
//     const result = {
//       type: "object",
//       required: ["a"],
//       properties: { a: { type: "string" } },
//     }
//     expect(extractSubschema(["/a"], schema)).toEqual(result)
//   })
// })
