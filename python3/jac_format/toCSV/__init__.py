import copy
# import
def join_path(a,b):
    return

def normalize_column_definitions(column):
    if column.startswith("."):
        return column
    else:
        return "."+column

def find_column_parent_array_path(column):
    if column is not None:
        return


def find_columns_parent_array_path(column):
    if column is not None:
        splitted_column_string = column.split(".")
        splitted_column_string = splitted_column_string.split(".")[-1][0]
        return splitted_column_string
    else:
        return None

def find_all_path(column_with_index, row_with_index):
    row_index = row_with_index[0]
    row = row_with_index[1]

    column_index = column_with_index[0]
    column = column_with_index[1]
    
    path = [join_path(row, column), row_index+1, column_index+1]

    return path

def to_csv(originalJSON):
    json = copy.deepcopy(originalJSON)

    path_array = path+columns
    array = [
        array_path
    ]

    columns = map(normalize_column_definitions, columns)

    column_parent_array_path = "" 

    # Line 53

    if remove_redundancies is not None:
        #import join_path.py
        all_paths = map(find_all_path, enumerate(rows))
        