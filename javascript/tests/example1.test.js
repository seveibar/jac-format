const test = require("ava")
const jac = require("../")
const papaparse = require("papaparse")

test("toJSON 1.1", (t) => {
  const result = jac.fromCSV(
    `
path,.,.color,.vitamins
fruits.0,,red,
veggies.1,,,B

`.trim()
  )
  t.deepEqual(result, {
    fruits: [{ color: "red" }],
    veggies: [undefined, { vitamins: "B" }],
  })
})

test("toCSV 1.1", (t) => {
  const result = jac.toCSV(
    {
      fruits: [{ color: "red" }],
      veggies: [undefined, { vitamins: "B" }],
    },
    {
      columns: [".", "color", ".vitamins"],
      rows: ["fruits.0", "veggies[1]"],
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

test("toCSV 1.2", (t) => {
  const result = jac.toCSV(
    {
      fruits: [{ color: "red" }],
      veggies: [undefined, { vitamins: "B" }],
    },
    {
      columns: ["color", ".vitamins"],
      rows: ["fruits.0", "veggies[1]"],
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

test("toCSV 1.3 (should fail validation)", (t) => {
  t.throws(() => {
    const result = jac.toCSV(
      {
        fruits: [{ color: "red", missingItem: "missingValue" }],
        veggies: [undefined, { vitamins: "B" }],
      },
      {
        columns: ["color", ".vitamins"],
        rows: ["fruits.0", "veggies[1]"],
      }
    )
    console.table(papaparse.parse(result).data)
  })
})

test("toCSV 1.4", (t) => {
  const result = jac.toCSV(
    {
      fruits: [{ color: "red" }, { color: "green" }],
    },
    {
      columns: [".", "color"],
      rows: ["fruits.*"],
    }
  )

  t.deepEqual(
    result.trim().replace(/\r/g, ""),
    `
path,.,color
fruits.0,,red
fruits.1,,green
`.trim()
  )
})

test("toCSV 1.5", (t) => {
  const result = jac.toCSV(
    {
      fruits: [
        { properties: { color: "red" } },
        { properties: { color: "green" } },
      ],
    },
    {
      columns: [".", "properties"],
      rows: ["fruits.*"],
    }
  )

  t.deepEqual(
    result.trim().replace(/\r/g, ""),
    `
path,.,properties
fruits.0,,"{""color"":""red""}"
fruits.1,,"{""color"":""green""}"
`.trim()
  )
})
