const test = require("ava")
const JAC = require("../")

test("column-first mode toJSON", (t) => {
  const json = {
    weeks: [
      {
        A: {
          pr_count: 3,
          prs: ["Fix 1", "Fix 2", "Fix 3"],
        },
        B: {
          pr_count: 2,
          prs: ["Fix 1", "Fix 2"],
        },
      },
      {
        A: {
          pr_count: 2,
          prs: ["Fix 1", "Fix 2"],
        },
        B: {
          pr_count: 1,
          prs: ["Fix 1"],
        },
      },
    ],
  }
  const options = {
    rows: [
      "A.pr_count",
      "B.pr_count",
      "C.pr_count",
      "A.prs.0",
      "A.prs.1",
      "A.prs.2",
      "A.prs.3",
      "B.prs.0",
      "B.prs.1",
      "B.prs.2",
    ],
    columns: [".", "weeks.0", "weeks.1"],
    columnFirst: true,
  }

  JAC.toCSV(json, options)
  t.pass("no validation errors")
})
