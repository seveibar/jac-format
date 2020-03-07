# JAC (JSON as CSV) Format

The JAC format makes it easy to convert to and from JSON and CSV file formats, while giving application developers a lot of flexibility in how easy it is to modify the CSV file.

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

## Convert a JAC CSV to a JSON file

Columns are read in order from left to right. Each row creates an object. This object is then set at the path.
