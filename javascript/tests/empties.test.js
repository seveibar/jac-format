const test = require("ava")
const jac = require("../")

test("should recreate normal empties correctly (with redundancy)", (t) => {
  const json = {
    emptyArray: [],
    emptyObject: {},
    emptyArrayWithEmptyArray: [[]],
    emptyObjectWithEmptyObject: { "": {} },
  }

  jac.toCSV(json, { removeRedundancies: false })
  // t.snapshot(jac.toCSV(json, { withoutRedundancy: false }))

  t.deepEqual(json, jac.toJSON(jac.toCSV(json)))
})
