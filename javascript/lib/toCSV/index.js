const papaparse = require("papaparse")
const setIn = require("lodash/set")
const getIn = require("lodash/get")
const isEqual = require("lodash/isEqual")
const merge = require("lodash/merge")
const isEmpty = require("lodash/isEmpty")
const cloneDeep = require("lodash/cloneDeep")
const flat = require("flat")

const removeRedundancies = require("./remove-redundancies")

const joinPath = require("../utils/join-path.js")
const toJSON = require("../toJSON")

function toCSV(originalJSON, { rows = ["."], columns = ["."], validate = true, removeRedundancies: shouldRemoveRedundancies = true, } = {}) {
    const json = cloneDeep(originalJSON)
    
    let ar = [
        ["path"].concat(columns)
    ]

    // Normalize column definitions
    columns = columns.map((c) => (c.startsWith(".") ? c : `.${c}`))

    // If the column refers to an array, note the path to the item's parent
    const columnParentArrayPath = columns.map((c) =>
        !isNaN(parseInt(c.split(".").slice(-1)[0])) ?
        c.split(".").slice(0, -1).join(".") :
        null
    )

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

    if (shouldRemoveRedundancies) {
        removeRedundancies({ rows, columns, array: ar })
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

module.exports = toCSV