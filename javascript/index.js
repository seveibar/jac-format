const toCSV = require("./lib/toCSV")
const replacePathStars = require("./lib/utils/replace-path-stars")
const removeRedundancies = require("./lib/toCSV/remove-redundancies")
const joinPath = require("./lib/utils/join-path")
const toJSON = require("./lib/toJSON")

module.exports = {
    toCSV,
    toJSON,
    fromCSV: toJSON,
    fromJSON: toCSV,

    replacePathStars,
    joinPath,
    removeRedundancies
}