const test = require("ava")
const jac = require("../")
const papaparse = require("papaparse")

test("toJSON 1.1", t => {
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

test("toCSV 1.1", t => {
  const result = jac.toCSV(
    {
      fruits: [{ color: "red" }],
      veggies: [undefined, { vitamins: "B" }]
    },
    {
      columns: [".", "color", ".vitamins"],
      rows: ["fruits.0", "veggies[1]"]
    }
  )

  t.deepEqual(
    result.trim().replace(/\r/g, ""),
    `
path,.,color,.vitamins
fruits.0,,red,
veggies[1],,,B
`.trim()
  )
})

test("toCSV 1.2", t => {
  const result = jac.toCSV(
    {
      fruits: [{ color: "red" }],
      veggies: [undefined, { vitamins: "B" }]
    },
    {
      columns: ["color", ".vitamins"],
      rows: ["fruits.0", "veggies[1]"]
    }
  )

  t.deepEqual(
    result.trim().replace(/\r/g, ""),
    `
path,color,.vitamins
fruits.0,red,
veggies[1],,B
`.trim()
  )
})

test("toCSV 1.3 (should fail validation)", t => {
  t.throws(() => {
    const result = jac.toCSV(
      {
        fruits: [{ color: "red", missingItem: "missingValue" }],
        veggies: [undefined, { vitamins: "B" }]
      },
      {
        columns: ["color", ".vitamins"],
        rows: ["fruits.0", "veggies[1]"]
      }
    )
    console.table(papaparse.parse(result).data)
  })
})
