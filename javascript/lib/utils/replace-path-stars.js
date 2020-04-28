function replacePathStars(paths) {
    const newPaths = []
    for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
        const path = paths[pathIndex]

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

module.exports = replacePathStars