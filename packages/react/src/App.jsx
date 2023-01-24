import _ from "lodash/fp.js"
import React from "react"
import { observer } from "mobx-react-lite"
import { chakra, Grid, Heading, Box, Checkbox } from "@chakra-ui/react"
import { Form } from "./form/Form.jsx"
import { createFormSchema } from "./form/index.js"
import { reduceSchema } from "@json-schema-form/core"

const schema = {
  type: "object",
  title: "Form",
  description: "People and animals all live in harmony",
  properties: {
    scalarArray: {
      type: "array",
      items: {
        type: "string",
      },
    },
    arr: {
      type: "array",
      items: {
        type: "object",
        required: ["name"],
        title: "Person",
        properties: {
          name: {
            type: "string",
            description: "Full name of the person in question",
          },
          job: {
            type: "string",
            enum: ["Analyst", "Courier", "Singer", "Mercenary"],
            readOnly: true,
          },
          age: { type: "number", minimum: 10 },
          isMarried: {
            type: "boolean",
            description: "Did you in fact get married?",
          },
        },
      },
    },
    // obj: {
    //   type: "object",
    //   required: ["zebra"],
    //   properties: {
    //     zebra: { type: "string" },
    //     lion: { type: "string" },
    //     giraffe: { type: "string" },
    //   },
    // },
  },
}

const value = {
  scalarArray: ["Pocahontas", "Snow White"],
  arr: [{ job: "Mercenary", age: 34, isMarried: true }],
  obj: { zebra: "Neiighhh!", lion: "Roar!", giraffe: "Who knows?" },
}

const flags = ["readonly", "required", "disabled", "hidden"]

const Flags = ({ schema }) => (
  <Grid
    sx={{
      gap: 2,
      height: "fit-content",
      gridTemplateColumns: "repeat(5, 1fr)",
      alignItems: "center",
      justifyItems: "center",
    }}
  >
    <span />
    {flags.map((path) => (
      <b key={path}>{path}</b>
    ))}
    {_.map(
      (schema) => (
        <React.Fragment key={schema.field.id}>
          <chakra.b sx={{ justifySelf: "start" }}>{schema.field.path}</chakra.b>
          {flags.map((path) => (
            <Checkbox
              key={path}
              defaultChecked={schema.field[path]}
              onChange={(e) => (schema.field[path] = e.target.checked)}
            />
          ))}
        </React.Fragment>
      ),
      reduceSchema(_.identity, schema)
    )}
  </Grid>
)

const SchemaFormData = observer(({ schema }) =>
  JSON.stringify(schema.field.formData, null, 2)
)

const SchemaErrors = observer(({ schema }) =>
  JSON.stringify(
    _.mapValues(
      (schema) => schema.field.validationMessage,
      reduceSchema(_.identity, schema)
    ),
    null,
    2
  )
)

const submits = {
  delayed: () => new Promise((resolve) => setTimeout(resolve, 500)),
  error: () =>
    new Promise((resolve, reject) =>
      setTimeout(() => reject("Your form Shucks!"), 500)
    ),
}

const formSchema = createFormSchema(schema, value)

export const App = () => (
  <Grid sx={{ gap: 8, p: 8, w: "100%", gridTemplateColumns: "auto auto 1fr" }}>
    <Flags schema={formSchema} />
    <Form schema={formSchema} submit={submits.error} sx={{ w: "30vw" }} />
    <Grid sx={{ gridTemplateColumns: "1fr 1fr" }}>
      <Box sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        <Heading>Form Data</Heading>
        <SchemaFormData schema={formSchema} />
      </Box>
      <Box sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        <Heading>Errors</Heading>
        <SchemaErrors schema={formSchema} />
      </Box>
    </Grid>
  </Grid>
)
