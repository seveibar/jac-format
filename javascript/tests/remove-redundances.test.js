const test = require("ava");
const jac = require("../");

test("remove redundancies 1", (t) => {
  const rows = ["fruits.0", "veggies[1]"];
  const columns = [".", ".color", ".vitamins"];
  const arrayToBeMutated = [
    ["path", ".", "color", ".vitamins"],
    ["fruits.0", { color: "red" }, "red", null],
    ["veggies[1]", { vitamins: "B" }, null, "B"],
  ];

  const correctArray = [
    ["path", ".", "color", ".vitamins"],
    ["fruits.0", undefined, "red", null],
    ["veggies[1]", undefined, null, "B"],
  ];

  jac.removeRedundancies({ rows, columns, array: arrayToBeMutated });

  t.deepEqual(arrayToBeMutated, correctArray);
});

// test("remove redundancies 1", (t) => {
//   const rows = ["myName", "friends.0", "friends.1"];
//   const columns = [".", "name", "dogs.0", "dogs.1"];
//   const arrayToBeMutated = [
//     [null].concat(columns),
//     [rows[0], "John", undefined, undefined, undefined],
//     [rows[1], { name: "Stacy", dogs: ["Rufus"] }, "Stacy", "Rufus", undefined],
//     [
//       rows[2],
//       { name: "Paul", dogs: ["Mr. Fluffs", "Whimpers"] },
//       "Paul",
//       "Mr. Fluffs",
//       "Whimpers",
//     ],
//   ];
//   const minArray = [
//     [null].concat(columns),
//     [rows[0], "John", undefined, undefined, undefined],
//     [rows[1], "Stacy", "Rufus", undefined],
//     [rows[2], "Paul", "Mr. Fluffs", "Whimpers"],
//   ];

//   jac.removeRedundancies({
//     rows,
//     columns,
//     array: arrayToBeMutated,
//   });

//   t.deepEqual(arrayToBeMutated, minArray);
// });
