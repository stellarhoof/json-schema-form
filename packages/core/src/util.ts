import _ from "lodash/fp.js"

export const joinPaths = (
  ...segments: (string | number | null | undefined)[]
) => _.filter((x) => x !== "" && !_.isNil(x), segments).join(".")
