import csv
import io
from .join_path import join_path
from .get_in import get_in
from .remove_redundancies import remove_redundancies
from sys import version_info


def to_csv(
    json, rows=["."], columns=["."], validate=True, should_remove_redundancies=True
):

    ar = [["path"] + columns]

    # Normalize column definitions
    columns = [c if c.startswith(".") else ".{}".format(c) for c in columns]

    # If the column refers to an array, note the path to the item's parent
    column_parent_array_path = []
    for c in columns:
        try:
            int(c.split(".")[-1])
            column_parent_array_path.append(".".join(c.split(".")[:-1]))
        except:
            column_parent_array_path.append(None)

    for rowi, row in enumerate(rows):
        new_row = [row]
        for coli, col in enumerate(columns):
            full_path = join_path(row, col)
            if full_path == ".":
                new_row.append(json)
                continue

            if column_parent_array_path[coli] is not None:
                # make sure the part before the index is not a string
                # i.e. the user can't use "string.0" as a path to the first char
                if isinstance(
                    get_in(json, join_path(row, column_parent_array_path[coli])), str
                ):
                    new_row.append(None)
                    continue

            new_row.append(get_in(json, full_path))
        ar.append(new_row)

    # ar is now in 2d redundant jac-format

    if should_remove_redundancies:
        remove_redundancies(rows=rows, columns=columns, array=ar)

    # make sure each cell value is in unicode
    for rowi in range(len(ar)):
        for coli in range(len(ar[rowi])):
            if ar[rowi][coli] is None:
                ar[rowi][coli] = ""
            else:
                ar[rowi][coli] = str(ar[rowi][coli])

    # turn ar into CSV
    if version_info.major == 2:
        output = io.BytesIO()
    else:
        output = io.StringIO()
    writer = csv.writer(output)
    writer.writerows(ar)
    result = output.getvalue()

    return result
