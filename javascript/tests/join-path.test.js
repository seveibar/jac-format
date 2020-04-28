const jac = require("../")
const test = require("ava")

test("join path test 1", (t) => {
    t.assert(jac.joinPath("samples.0", "output") === "samples.0.output")
})

test("join path test 2", (t) => {
    t.assert(jac.joinPath("samples.0.", ".output") === "samples.0.output")
})

test("join path test 3", (t) => {
    t.assert(jac.joinPath("samples.0", ".output") === "samples.0.output")
})

test("join path test 4", (t) => {
    t.assert(jac.joinPath("samples.0.", "output") === "samples.0.output")
})

test("join path test 5", (t) => {
    t.assert(jac.joinPath(".", "output") === "output")
})

test("join path test 6", (t) => {
    t.assert(jac.joinPath("output", ".") === "output")
})

test("join path test 7", (t) => {
    t.assert(jac.joinPath(".", ".") === ".")
})
