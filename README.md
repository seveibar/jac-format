# JAC (JSON as CSV) Format

The JAC format makes it easy to convert to and from JSON and CSV file formats, while giving application developers a lot of flexibility to customize how easy it is to modify the CSV file for end users.

`.jac.csv` files are always valid CSVs.

An example JAC file is shown below:

| path | . | .name | .dogs.0 | .dogs.1 |
| ---- | - | ----- | ------- | ------- |
| myName | John | | | |
| friends.0 | | Stacy | Rufus | |
| friends.1 | | Paul  | Mr. Fluffs | Whimpers |

When this file is converted into JSON, it becomes:

```javascript
{
  "myName": "John",
  "friends": [
    {
      "name": "Stacy",
      "dogs": ["Rufus"]
    },
    {
      "name": "Paul",
      "dogs": ["Mr. Fluffs", "Whimpers"]
    }
  ]
}
```

## Rules

* JAC CSV files are valid CSVs
* Each cell of a JAC CSV file is 1) a string or 2) a valid JSON object. Cells do not require quotes.
* Columns right of the "path" column are applied in order from left to right. Each row creates an object. This object is then set at the path of the first column.

## Pros & Cons

The flexibility of the JAC CSV format allows applications that output JAC CSV to give the user CSV data in a "flattening" that is most convenient for the application i.e. Columns can be created to make it easy for the user to modify the data.

As a result of the flexibility in the JAC CSV format, one JSON file can have almost an infinite amount of variations.

