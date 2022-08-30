const test = require("ava")
const jac = require("../")

test("remove redundancies 1", (t) => {
  const rows = ["fruits.0", "veggies[1]"]
  const columns = [".", ".color", ".vitamins"]
  const arrayToBeMutated = [
    ["path", ".", "color", ".vitamins"],
    ["fruits.0", { color: "red" }, "red", null],
    ["veggies[1]", { vitamins: "B" }, null, "B"],
  ]

  const correctArray = [
    ["path", ".", "color", ".vitamins"],
    ["fruits.0", undefined, "red", null],
    ["veggies[1]", undefined, null, "B"],
  ]

  jac.removeRedundancies({ rows, columns, array: arrayToBeMutated })

  t.deepEqual(arrayToBeMutated, correctArray)
})
