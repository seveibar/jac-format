function joinPath(rowPath, columnPath) {
  if (!rowPath) throw new Error(`Column path is empty!`)
  if (!columnPath) throw new Error(`Row path is empty!`)

  rowPath = rowPath.trim()
  columnPath = columnPath.trim()

  // Remove dots from beginning and end of rowPath, make sure columnPath has
  // a dot in front of it
  if (rowPath.endsWith(".")) rowPath = rowPath.slice(0, -1)
  if (rowPath.endsWith(".")) columnPath = columnPath.slice(0, -1)
  if (rowPath.startsWith(".")) rowPath = rowPath.slice(1)
  if (!columnPath.startsWith(".")) columnPath = "." + columnPath

  if (rowPath === "") return columnPath.slice(1) || "."
  if (columnPath === ".") return rowPath

  return rowPath + columnPath
}

module.exports = joinPath
