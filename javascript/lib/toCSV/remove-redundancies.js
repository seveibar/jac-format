const flat = require("flat")
const setIn = require("lodash/set")
const getIn = require("lodash/get")
const isEmpty = require("lodash/isEmpty")
const merge = require("lodash/merge")
const joinPath = require("../utils/join-path.js")

// Simplify each cell so cells never include unnecessary information
function removeRedundancies({ rows, columns, array }) {
  // Get each cell path starting from the top left and going to the bottom
  // right
  const allPaths = rows.flatMap((row, rowIndex) =>
    columns.map((column, columnIndex) => [
      joinPath(row, column),
      rowIndex + 1,
      columnIndex + 1,
    ])
  )

  console.log("all_paths", allPaths)

  // Paths are applied in reverse order
  allPaths.reverse()

  console.log("all_paths", allPaths)

  let reconstructedObject = {}
  for (const [basePath, rowIndex, columnIndex] of allPaths) {
    console.log(basePath, rowIndex, columnIndex)
    if (array[rowIndex][columnIndex] === null) continue
    if (array[rowIndex][columnIndex] === undefined) continue
    if (typeof array[rowIndex][columnIndex] === "object") {
      console.log(basePath, "is object")
      // flatten this object to get the subpaths
      const flattenedObject = flat.flatten(array[rowIndex][columnIndex])
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
      console.log("paths_to_remove", pathsToRemove)
      if (!isEmpty(pathsToRemove)) {
        const newObject = {}
        for (const subPath in flattenedObject) {
          if (!pathsToRemove[subPath]) {
            setIn(newObject, subPath, flattenedObject[subPath])
          }
        }
        if (isEmpty(newObject)) {
          array[rowIndex][columnIndex] = undefined
        } else {
          array[rowIndex][columnIndex] = newObject
        }
      }
    } else {
      console.log(basePath, "is not object")
      const existingValue = getIn(reconstructedObject, basePath)
      console.log(basePath, "existing value", existingValue)
      if (existingValue === array[rowIndex][columnIndex]) {
        array[rowIndex][columnIndex] = undefined
      }
    }
    if (
      typeof array[rowIndex][columnIndex] === "object" &&
      getIn(reconstructedObject, basePath)
    ) {
      setIn(
        reconstructedObject,
        basePath,
        merge(
          array[rowIndex][columnIndex],
          getIn(reconstructedObject, basePath)
        )
      )
    } else if (array[rowIndex][columnIndex] !== undefined) {
      setIn(reconstructedObject, basePath, array[rowIndex][columnIndex])
    }
  }
}

module.exports = removeRedundancies
