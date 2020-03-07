const test = require("ava")
const JAC = require("../")

test("example2", t => {
  const json = {
    interface: {
      type: "image_segmentation",
      availableLabels: ["valid", "invalid"],
      regionTypesAllowed: ["bounding-box", "polygon", "point"]
    },
    samples: [
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg"
      },
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg"
      }
    ]
  }
  JAC.toCSV(json, {
    rows: ["interface", "samples.0", "samples.1"],
    columns: [".", ".imageUrl", ".output"]
  })
  t.pass("no validation errors")
})
