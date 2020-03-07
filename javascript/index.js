const papaparse = require("papaparse")
const setIn = require("lodash/set")

function getCellValue(cell) {
  if (cell === "") return undefined
  try {
    return JSON.parse(cell)
  } catch (e) {
    return cell
  }
}

function toCSV(json, { rows = [], columns = [] }) {}

function toJSON(csvString) {
  const rows = papaparse.parse(csvString).data
  const header = rows[0]
  for (let headeri = 1; headeri < header.length; headeri++) {
    if (!header[headeri].startsWith(".")) {
      header[headeri] = "." + header[headeri]
    }
  }
  const obj = {}
  for (const row of rows.slice(1)) {
    for (let celli = 1; celli < row.length; celli++) {
      const cellValue = getCellValue(row[celli])
      if (cellValue === undefined) continue
      setIn(obj, row[0] + header[celli], cellValue)
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
