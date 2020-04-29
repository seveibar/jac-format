def join_path(row_path, column_path):
    if column_path is None:
        raise Exception("Column path is empty!")
    if row_path is None:
        raise Exception("Row path is empty")
    
    column_path = column_path.strip()
    row_path = row_path.strip()
    
    if len(row_path) > 0 and row_path[-1] == ".":
        row_path = row_path[0:-1]
    if len(column_path) > 0 and column_path[-1] == ".":
        column_path = column_path[0:-1]
    if len(row_path) > 0 and row_path[0] == ".":
        row_path = row_path[1:]
    if len(column_path) and column_path[0] != ".":
        column_path = "." + column_path
        
    if row_path == "":
        return column_path[1:] if len(column_path) > 1 else "."
    if column_path == ".":
        return row_path

    return row_path+column_path