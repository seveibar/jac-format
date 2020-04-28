def join_path(column_path, row_path):
    if column_path is None:
        raise Exception("Column path is empty!")
    if row_path is None:
        raise Exception("Row path is empty")
    
    # re.sub is String.trim() on javascript side
    column_path = column_path.strip()
    row_path = row_path.strip()

    if column_path == '.' and row_path == '.':
        return '.'
    if column_path == '' and row_path == '.':
        return '.'
    if row_path == '.':
        return column_path

    return column_path+row_path