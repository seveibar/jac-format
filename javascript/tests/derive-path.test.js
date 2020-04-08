const test = require("ava")
const jac = require("../")
const papaparse = require("papaparse")

test("toJSON 1.1", (t) => {
  const result = jac.fromCSV(
    `
.,.color,.vitamins
,red,
,,B

`.trim(),
    {
      derivePath: (rowIndex, obj) => {
        if (obj.color) {
          return "fruits.*"
        }
        if (obj.vitamins) {
          return "veggies.*"
        }
      },
    }
  )
  t.deepEqual(result, {
    fruits: [{ color: "red" }],
    veggies: [{ vitamins: "B" }],
  })
})
