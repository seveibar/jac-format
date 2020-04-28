const flat = require("flat")
const setIn = require("lodash/set")
const getIn = require("lodash/get")
const isEmpty = require("lodash/isEmpty")
const merge = require("lodash/merge")
const joinPath = require("../utils/join-path.js")

function removeRedundancies({ rows, columns, array }) {
    
    // Simplify each cell so cells never include unnecessary information
    const allPaths = rows.flatMap((row, rowIndex) =>
        columns.map((column, columnIndex) => [joinPath(row, column), rowIndex + 1, columnIndex + 1])
    )
    
    // Paths are applied in reverse order
    allPaths.reverse()

    let reconstructedObject = {}
    for (const [basePath, rowIndex, columnIndex] of allPaths) {
        if (array[rowIndex][columnIndex] === null) continue
        if (array[rowIndex][columnIndex] === undefined) continue
        if (typeof array[rowIndex][columnIndex] === "object") {
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
            const existingValue = getIn(reconstructedObject, basePath)
            if (existingValue === array[rowIndex][columnIndex]) {
                array[rowIndex][columnIndex] = undefined
            }
        }
        if (
            typeof array[rowIndex][columnIndex] === "object" && getIn(reconstructedObject, basePath)
        ) {
            setIn(
                reconstructedObject,
                basePath,
                merge(array[rowIndex][columnIndex], getIn(reconstructedObject, basePath))
            )
        } else if (array[rowIndex][columnIndex] !== undefined) {
            setIn(reconstructedObject, basePath, array[rowIndex][columnIndex])
        }
    }
}

module.exports = removeRedundancies