import csv
from functools import reduce
from .replace_path_stars import replace_path_stars
from .join_path import join_path
from .get_cell_value import get_cell_value
from .set_in import set_in


def to_json(csv_string, options={}):
    reader = csv.reader(csv_string.split("\n"), delimiter=",")
    rows = []
    for row in reader:
        rows.append(row)

    print("rows", rows)

    if rows[0][0] != "path" and rows[0][0] != "jac_csv_path":
        if not "derivePath" in options:
            raise Exception(
                'No "path" or "jac_csv_path" in first cell (make sure this file is formatted in the JAC format https://github.com/seveibar/jac-format)'
            )
        # rows_with_index = enumerate(rows)
        # for row_with_index in rows_with_index:
        #     row_index = row_with_index[0]
        #     row_object = rows[row_index]
        #     row_object = reduce(lambda x, y:)
        #     # line 16

        #     # new_paths =

    new_paths = replace_path_stars([row[0] for row in rows[1:]])

    for row_index in range(1, len(rows)):
        rows[row_index][0] = new_paths[row_index - 1]

    header = replace_path_stars(
        [row if row[0] == "." else "." + row for row in rows[0]]
    )

    obj = {}
    for row in rows[1:]:
        for cell_index in range(1, len(row)):
            if header[cell_index] is None:
                continue
            if row[0] is None:
                continue

            full_path = join_path(row[0], header[cell_index])
            cell_value = get_cell_value(row[cell_index])

            if cell_value is None:
                continue

            if full_path == ".":
                obj = cell_value
                continue
            obj = set_in(obj, full_path, cell_value)

    return obj
