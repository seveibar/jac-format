const test = require("ava")
const jac = require("../")

test("should recreate normal empties correctly", t => {
  const json = {
    emptyArray: [],
    emptyObject: {},
    emptyArrayWithEmptyArray: [[]],
    emptyObjectWithEmptyObject: { "": {} }
  }

  t.snapshot(jac.toCSV(json))

  t.deepEqual(json, jac.toJSON(jac.toCSV(json)))
})
