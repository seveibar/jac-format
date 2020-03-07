const test = require("ava")
const JAC = require("../")
const papaparse = require("papaparse")

test("example 2.1", t => {
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

test("example 2.2", t => {
  const json = {
    interface: {
      type: "image_segmentation",
      availableLabels: ["valid", "invalid"],
      regionTypesAllowed: ["bounding-box", "polygon", "point"]
    },
    samples: [
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
        output: [
          {
            color: "hsl(336,100%,50%)",
            points: [
              { x: 0.13557046979865772, y: 0.3030201342281879 },
              { x: 0.10604026845637583, y: 0.38859060402684564 },
              { x: 0.14899328859060404, y: 0.41275167785234895 }
            ],
            regionType: "polygon"
          }
        ]
      },
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
        output: null
      }
    ]
  }
  const csvString = JAC.toCSV(json, {
    rows: ["interface", "samples.0", "samples.1"],
    columns: [
      ".",
      ".imageUrl",
      ".output",
      ".output.0.regionType",
      ".output.0.classification",
      ".output.0.labels",
      ".output.0.color",
      ".output.0.points.0.x",
      ".output.0.points.0.y",
      ".output.0.points.1.x",
      ".output.0.points.1.y",
      ".output.0.points.2.x",
      ".output.0.points.2.y"
    ]
  })
  t.assert(csvString.match(/0\.13557046979865772/g).length === 1)
  t.snapshot(csvString)
  t.pass("no validation errors")
})

test("example 2.3", t => {
  const json = {
    interface: {
      type: "image_segmentation",
      availableLabels: ["valid", "invalid"],
      regionTypesAllowed: ["bounding-box", "polygon", "point"]
    },
    samples: [
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
        output: [
          {
            regionType: "polygon",
            color: "hsl(359,100%,50%)",
            points: [
              { x: 0.10921501706484642, y: 0.3122866894197952 },
              { x: 0.10238907849829351, y: 0.40273037542662116 },
              { x: 0.4800910125142207, y: 0.34812286689419797 },
              { x: 0.459613196814562, y: 0.26109215017064846 }
            ]
          }
        ]
      },
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
        output: null
      }
    ]
  }
  const options = {
    rows: ["interface", "samples.0", "samples.1"],
    columns: [
      ".",
      "imageUrl",
      "output",
      "output.0.regionType",
      "output.0.color",
      "output.0.points.0.x",
      "output.0.points.0.y",
      "output.0.points.1.x",
      "output.0.points.1.y",
      "output.0.points.2.x",
      "output.0.points.2.y",
      "output.0.points.3.x",
      "output.0.points.3.y"
    ]
  }

  JAC.toCSV(json, options)
  t.pass("no validation errors")
})
