const papaparse = require("papaparse")
const setIn = require("lodash/set")
const getIn = require("lodash/get")
const isEqual = require("lodash/isEqual")
const merge = require("lodash/merge")
const isEmpty = require("lodash/isEmpty")
const cloneDeep = require("lodash/cloneDeep")
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
  if (!p1) throw new Error(`Column path is empty!`)
  if (!p2) throw new Error(`Row path is empty!`)
  p1 = p1.trim()
  p2 = p2.trim()
  if (p1.endsWith(".")) p1 = p1.slice(0, -1)
  if (p2.endsWith(".")) p2 = p2.slice(0, -1)
  if (p1.startsWith(".")) p1 = p1.slice(1)
  if (!p2.startsWith(".")) p2 = "." + p2

  if (p1 === "." && p2 === ".") return "."
  if (p1 === "" && p2 === ".") return "."
  if (p2 === ".") return p1
  return p1 + p2
}

function toCSV(
  originalJSON,
  {
    rows = ["."],
    columns = ["."],
    validate = true,
    removeRedundancies = true,
  } = {}
) {
  const json = cloneDeep(originalJSON)
  let ar = [["path"].concat(columns)]

  // Normalize column definitions
  columns = columns.map((c) => (c.startsWith(".") ? c : `.${c}`))

  // If the column refers to an array, note the path to the item's parent
  const columnParentArrayPath = columns.map((c) =>
    !isNaN(parseInt(c.split(".").slice(-1)[0]))
      ? c.split(".").slice(0, -1).join(".")
      : null
  )

  // support .some.path.array.* in rows[]
  rows = rows.flatMap((row) => {
    if (row.endsWith(".*")) {
      const arrayPath = row.replace(/\.\*$/, "")
      const array = getIn(json, arrayPath)
      const expanded_rows = []
      for (let i = 0; i < array.length; i++) {
        expanded_rows.push(joinPath(arrayPath, `.${i}`))
      }
      return expanded_rows
    }
    return row
  })

  for (let i = 0; i < rows.length; i++) {
    let row = [rows[i]]
    for (let u = 0; u < columns.length; u++) {
      const fullPath = joinPath(rows[i], columns[u])
      if (fullPath === ".") {
        row.push(json)
        continue
      }
      if (columnParentArrayPath[u]) {
        // make sure the part before the index is not a string
        // i.e. the user can't use "string.0" as a path to the first char
        if (
          typeof getIn(json, joinPath(rows[i], columnParentArrayPath[u])) ===
          "string"
        ) {
          row.push(undefined)
          continue
        }
      }
      row.push(getIn(json, fullPath))
    }
    ar.push(row)
  }

  if (removeRedundancies) {
    // Simplify each cell so cells never include unnecessary information
    const allPaths = rows.flatMap((r, ri) =>
      columns.map((c, ci) => [joinPath(r, c), ri + 1, ci + 1])
    )
    // Paths are applied in reverse order
    allPaths.reverse()

    let reconstructedObject = {}
    for (const [basePath, ri, ci] of allPaths) {
      if (ar[ri][ci] === null) continue
      if (ar[ri][ci] === undefined) continue
      if (typeof ar[ri][ci] === "object") {
        // flatten this object to get the subpaths
        const flattenedObject = flat.flatten(ar[ri][ci])
        const pathsToRemove = {}
        for (const subPath in flattenedObject) {
          const fullPath = joinPath(basePath, subPath)
          const existingValue = getIn(reconstructedObject, fullPath)
          if (
            (existingValue === null || existingValue === undefined) &&
            (flattenedObject[subPath] === undefined ||
              flattenedObject[subPath] === null)
          ) {
            pathsToRemove[subPath] = true
            continue
          }
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
            ar[ri][ci] = undefined
          } else {
            ar[ri][ci] = newObject
          }
        }
      } else {
        const existingValue = getIn(reconstructedObject, basePath)
        if (existingValue === ar[ri][ci]) {
          ar[ri][ci] = undefined
        }
      }
      if (
        typeof ar[ri][ci] === "object" &&
        getIn(reconstructedObject, basePath)
      ) {
        setIn(
          reconstructedObject,
          basePath,
          merge(ar[ri][ci], getIn(reconstructedObject, basePath))
        )
      } else if (ar[ri][ci] !== undefined) {
        setIn(reconstructedObject, basePath, ar[ri][ci])
      }
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
    const resultJSON = JSON.parse(JSON.stringify(toJSON(result)))
    const normalizedJSON = JSON.parse(JSON.stringify(originalJSON))

    if (!isEqual(resultJSON, normalizedJSON)) {
      throw new Error(
        "Validation after conversion to JAC CSV failed. The JAC CSV is missing information that the original JSON had.\n\n" +
          `Original JSON: ${JSON.stringify(
            originalJSON,
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

function replacePathStars(paths) {
  const newPaths = []
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]

    if (!path.includes("*")) {
      newPaths.push(path)
      continue
    }

    const prefix = path.replace(/\[?\*.*/, "")

    const isNewItem = path.replace(prefix, "").replace(/\*\]?/, "").length === 0

    let lastNumber = null
    for (let j = newPaths.length - 1; j >= 0; j--) {
      if (newPaths[j].startsWith(prefix)) {
        lastNumber = parseInt(
          newPaths[j].replace(prefix, "").match(/\[?([0-9])+/)[1]
        )
        break
      }
    }

    const newPath = path.replace(
      "*",
      lastNumber === null ? 0 : isNewItem ? lastNumber + 1 : lastNumber
    )

    newPaths.push(newPath)
  }
  return newPaths
}

function toJSON(csvString, options = {}) {
  const rows = papaparse.parse(csvString).data

  if (rows[0][0] !== "path" && rows[0][0] !== "jac_csv_path") {
    if (!options.derivePath)
      throw new Error(
        'No "path" or "jac_csv_path" in first cell (make sure this file is formatted in the JAC format https://github.com/seveibar/jac-format)'
      )
    for (let i = 1; i < rows.length; i++) {
      const rowObject = rows[i].reduce(
        (acc, v, vi) => ((acc[rows[0][vi].replace(/^\./, "")] = v), acc),
        {}
      )
      const newPath = options.derivePath(rowObject, i - 1)
      if (!newPath)
        throw new Error(
          "derivePath returned falsy for this row:\n" +
            JSON.stringify(rowObject)
        )
      rows[i] = [newPath].concat(rows[i])
    }
    rows[0] = ["jac_csv_path"].concat(rows[0])
  }

  // Replace wildcards
  const newPaths = replacePathStars(rows.slice(1).map((r) => r[0]))
  rows.slice(1).forEach((modifiedRow, modifiedRowIndex) => {
    modifiedRow[0] = newPaths[modifiedRowIndex]
  })

  // Normalize and extract header
  const header = replacePathStars(
    rows[0].map((c) => (c.startsWith(".") ? c : `.${c}`))
  )

  let obj = {}
  for (const row of rows.slice(1)) {
    for (let celli = 1; celli < row.length; celli++) {
      if (header[celli] === undefined) continue
      if (row[0] === undefined) continue
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
  fromJSON: toCSV,

  replacePathStars,
}
