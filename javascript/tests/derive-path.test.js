const test = require("ava")
const jac = require("../")
const papaparse = require("papaparse")

test("derive path test 1", (t) => {
  const result = jac.fromCSV(
    `
.,.color,.vitamins
,red,
,,B

`.trim(),
    {
      derivePath: (obj, rowIndex) => {
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

test("derive path test 2", (t) => {
  const result = jac.fromCSV(
    `
imageUrl
https://example.com/image1.jpg
https://example.com/image2.jpg
https://example.com/image3.jpg
`.trim(),
    {
      derivePath: (obj) => {
        return "item.*"
      },
    }
  )
  t.deepEqual(result, {
    item: [
      { imageUrl: "https://example.com/image1.jpg" },
      { imageUrl: "https://example.com/image2.jpg" },
      { imageUrl: "https://example.com/image3.jpg" },
    ],
  })
})
