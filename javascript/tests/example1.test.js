const test = require("ava")
const jac = require("../")

test("example1, version 1", t => {
  const result = jac.fromCSV(
    `
path,.,.color,.vitamins
fruits.0,,red,
veggies.1,,,B

`.trim()
  )
  t.deepEqual(result, {
    fruits: [{ color: "red" }],
    veggies: [undefined, { vitamins: "B" }]
  })
})
