function getCellValue(cell) {
    if (cell === "") return undefined
    try {
        return JSON.parse(cell)
    } catch (e) {
        return cell
    }
}

module.exports = getCellValue