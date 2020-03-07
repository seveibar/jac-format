const papaparse = require("papaparse")
const setIn = require("lodash/set")
const getIn = require("lodash/get")
const isEqual = require("lodash/isEqual")
const isEmpty = require("lodash/isEmpty")
const flat = require("flat")

function getCellValue(cell) {
  if (cell === "") return undefined
  try {
    return JSON.parse(cell)
  } catch (e) {
    return cell
  }
}

function joinPath(p1, p2) {
  if (p1.endsWith(".")) p1 = p1.slice(0, -1)
  if (p2.endsWith(".")) p2 = p2.slice(0, -1)
  if (p1.startsWith(".")) p1 = p1.slice(1)
  if (!p2.startsWith(".")) p2 = "." + p2
  return p1 + p2
}

function toCSV(
  json,
  {
    rows = ["."],
    columns = ["."],
    validate = true,
    removeRedundancies = true
  } = {}
) {
  let ar = [["path"].concat(columns)]

  // Normalize column definitions
  columns = columns.map(c => (c.startsWith(".") ? c : `.${c}`))

  for (let i = 0; i < rows.length; i++) {
    let row = [rows[i]]
    for (let u = 0; u < columns.length; u++) {
      const fullPath = joinPath(rows[i], columns[u])
      if (fullPath === ".") {
        row.push(json)
        continue
      }
      row.push(getIn(json, fullPath))
    }
    ar.push(row)
  }

  if (removeRedundancies) {
    // Simplify each cell so cells never include unnecessary information
    const allPaths = rows.flatMap((r, ri) =>
      columns.map((c, ci) => [r + c, ri + 1, ci + 1])
    )
    // Paths are applied in reverse order
    allPaths.reverse()

    let reconstructedObject = {}
    for (const [basePath, ri, ci] of allPaths) {
      if (typeof ar[ri][ci] === "object") {
        // flatten this object to get the subpaths
        const flattenedObject = flat.flatten(ar[ri][ci])
        const pathsToRemove = {}
        for (const subPath in flattenedObject) {
          const fullPath = joinPath(basePath, subPath)
          const existingValue = getIn(reconstructedObject, fullPath)
          if (existingValue === flattenedObject[subPath]) {
            pathsToRemove[subPath] = true
          }
        }
        if (!isEmpty(pathsToRemove)) {
          const newObject = {}
          for (const subPath in flattenedObject) {
            if (!pathsToRemove[subPath]) {
              setIn(newObject, subPath, flattenedObject[subPath])
            }
          }
          if (isEmpty(newObject)) {
            ar[ri][ci] = ""
          } else {
            ar[ri][ci] = newObject
          }
        }
      } else {
        const existingValue = getIn(reconstructedObject, basePath)
        if (existingValue === ar[ri][ci]) {
          ar[ri][ci] = ""
        }
      }
      setIn(reconstructedObject, basePath, ar[ri][ci])
    }
  }

  for (let ri = 0; ri < ar.length; ri++) {
    for (let ci = 0; ci < ar[ri].length; ci++) {
      if (typeof ar[ri][ci] === "object") {
        ar[ri][ci] = JSON.stringify(ar[ri][ci])
      }
    }
  }

  const result = papaparse.unparse(ar)

  if (validate) {
    const resultJSON = toJSON(result)
    const normalizedJSON = JSON.parse(JSON.stringify(json))
    if (!isEqual(resultJSON, json)) {
      throw new Error(
        "Validation after conversion to JAC CSV failed. The JAC CSV is missing information that the original JSON had.\n\n" +
          `Original JSON: ${JSON.stringify(
            json,
            null,
            "  "
          )}\n\nJAC CSV converted JSON: ${JSON.stringify(
            resultJSON,
            null,
            " "
          )}\n\nYou may need to add more rows or columns. This is what was specified:\n${JSON.stringify(
            { rows, columns },
            null,
            "  "
          )}\n\nYou can always turn validation off to output the partial representation shown above.`
      )
    }
  }

  return result
}

function toJSON(csvString) {
  const rows = papaparse.parse(csvString).data

  // Normalize and extract header
  const header = [rows[0][0]].concat(
    rows[0].slice(1).map(c => (c.startsWith(".") ? c : `.${c}`))
  )

  let obj = {}
  for (const row of rows.slice(1)) {
    for (let celli = 1; celli < row.length; celli++) {
      const fullPath = joinPath(row[0], header[celli])
      const cellValue = getCellValue(row[celli])
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

module.exports = {
  toCSV,
  toJSON,
  fromCSV: toJSON,
  fromJSON: toCSV
}
