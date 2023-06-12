const papaparse = require("papaparse")
const replacePathStars = require("../utils/replace-path-stars")
const joinPath = require("../utils/join-path.js")
const setIn = require("lodash/set")
const getCellValue = require("./get-cell-value")
const reflect2dArray = require("../utils/reflect-2d-array.js")

function toJSON(csvString, options = {}) {
  let rows = papaparse.parse(csvString).data

  const isColumnFirst = rows[0][0] === "path (column first)"
  // HACK: reflect the array if we're in column first mode
  if (isColumnFirst) {
    rows = reflect2dArray(rows)
  }

  if (
    rows[0][0] !== "path" &&
    rows[0][0] !== "path (column first)" &&
    rows[0][0] !== "jac_csv_path"
  ) {
    if (!options.derivePath)
      throw new Error(
        'No "path" or "jac_csv_path" in first cell (make sure this file is formatted in the JAC format https://github.com/seveibar/jac-format)'
      )
    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      const rowObject = rows[rowIndex].reduce(
        (accumulator, rowObjectItem, rowObjectItemIndex) => (
          (accumulator[rows[0][rowObjectItemIndex].replace(/^\./, "")] =
            rowObjectItem),
          accumulator
        ),
        {}
      )
      const newPath = options.derivePath(rowObject, rowIndex - 1)
      if (!newPath)
        throw new Error(
          "derivePath returned falsy for this row:\n" +
            JSON.stringify(rowObject)
        )
      rows[rowIndex] = [newPath].concat(rows[rowIndex])
    }
    rows[0] = ["jac_csv_path"].concat(rows[0])
  }

  // Replace wildcards
  const newPaths = replacePathStars(rows.slice(1).map((row) => row[0]))

  rows.slice(1).forEach((modifiedRow, modifiedRowIndex) => {
    modifiedRow[0] = newPaths[modifiedRowIndex]
  })

  // Normalize and extract header
  const header = replacePathStars(
    rows[0].map((column) => (column.startsWith(".") ? column : `.${column}`))
  )

  let obj = {}
  for (const row of rows.slice(1)) {
    for (let cellIndex = 1; cellIndex < row.length; cellIndex++) {
      if (header[cellIndex] === undefined) continue
      if (row[0] === undefined) continue
      const fullPath = joinPath(row[0], header[cellIndex])
      // join("samples.0", "cats.0")
      // samples.0.cats.0
      const cellValue = getCellValue(row[cellIndex])
      if (cellValue === undefined) continue
      if (fullPath === ".") {
        obj = cellValue
        continue
      }
      setIn(obj, fullPath, cellValue)
    }
  }
  return obj
}

module.exports = toJSON
