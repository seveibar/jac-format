const test = require("ava")
const jac = require("../")
const papaparse = require("papaparse")

test("toCSV 3.1", (t) => {
  const result = jac.toCSV(
    {
      array: [
        {
          key: ["string_in_array"],
        },
        {
          key: "string",
        },
      ],
    },
    {
      rows: ["array.0", "array.1"],
      columns: [".", ".key", ".key.0"],
    }
  )

  t.deepEqual(
    result.trim().replace(/\r/g, ""),
    `
path,.,.key,.key.0
array.0,,,string_in_array
array.1,,string,

  `.trim()
  )
})
