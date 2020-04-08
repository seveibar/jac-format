const test = require("ava")
const jac = require("../")
const papaparse = require("papaparse")

test("replace path stars 1", (t) => {
  t.deepEqual(
    jac.replacePathStars([
      "interface",
      "samples.*",
      "samples.*",
      "samples.*",
      "output.*",
      "output.*",
      "metadata",
    ]),
    [
      "interface",
      "samples.0",
      "samples.1",
      "samples.2",
      "output.0",
      "output.1",
      "metadata",
    ]
  )
})
