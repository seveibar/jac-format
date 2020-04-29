import csv
from functools import reduce
import replace_path_stars

def row_pbject_reduce(row_object):
    return

def to_json(csv_string, options={}):
    reader = csv.reader(csv_string.split("\n"), delimiter=",")
    rows = []
    for row in reader:
        rows.append(row)
    print(rows)

    # can be not too
    if rows[0][0] != "path" and rows[0][0] != "jac_csv_path":
        if not "derivePath" in options:
            raise Exception('No "path" or "jac_csv_path" in first cell (make sure this file is formatted in the JAC format https://github.com/seveibar/jac-format)')
        # rows_with_index = enumerate(rows)
        # for row_with_index in rows_with_index:
        #     row_index = row_with_index[0]
        #     row_object = rows[row_index]
        #     row_object = reduce(lambda x, y:)
        #     # line 16

        #     # new_paths = 
    
    # new_paths = replace_path_stars(rows[1:], )


result = to_json("""path,.,.color,.vitamins
fruits.0,,red,
veggies.1,,,B""")
print(result)