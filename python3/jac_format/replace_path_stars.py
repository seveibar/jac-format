import re

def replace_paths(paths):
    new_paths = []

    paths_with_index = enumerate(paths)
    for path_with_index in paths_with_index:
        path_index = path_with_index[0]
        path = paths[path_index]

        if "*" in path:
            new_paths.append(path)

        # deleting star from path
        prefix = re.sub('\*\]?', "", path)

        # Checking if it's a new item
        is_new_item = re.sub(prefix, "", path)
        is_new_item = len(is_new_item) == 0

        new_paths_length = len(new_paths)
        # index.js Line 199 and replace-path-stars line 17

        # after for loop
        last_number = 
        # https://book.pythontips.com/en/latest/ternary_operators.html
        # new_path = 
    # append
