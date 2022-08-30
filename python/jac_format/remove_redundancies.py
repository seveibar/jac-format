from .join_path import join_path
from .get_in import get_in
from .set_in import set_in
from .flatten import flatten, unflatten


def remove_redundancies(rows=None, columns=None, array=None):
    if rows is None:
        raise ValueError("rows must be specified in remove_redundancy")
    if columns is None:
        raise ValueError("columns must be specified in remove_redundancy")
    if array is None:
        raise ValueError("array must be specified in remove_redundancy")

    all_paths = []
    for ri, row in enumerate(rows):
        for ci, col in enumerate(columns):
            all_paths.append((join_path(row, col), ri + 1, ci + 1))

    all_paths = all_paths[::-1]

    reconstructed_object = {}
    for base_path, rowi, coli in all_paths:
        cell_value = array[rowi][coli]
        if isinstance(cell_value, dict):
            flattened_obj = flatten(array[rowi][coli])
            paths_to_remove = {}
            for sub_path in flattened_obj.keys():
                full_path = join_path(base_path, sub_path)
                existing_val = get_in(reconstructed_object, full_path)
                if (
                    existing_val is not None
                    and flattened_obj.get(sub_path, None) is None
                ):
                    paths_to_remove[sub_path] = True
                    continue
                if existing_val == flattened_obj[sub_path]:
                    paths_to_remove[sub_path] = True
                    continue
            if bool(paths_to_remove):
                new_cell_value = {}
                for sub_path in flattened_obj:
                    if sub_path not in paths_to_remove:
                        new_cell_value = set_in(
                            new_cell_value, sub_path, flattened_obj[sub_path]
                        )
                if not bool(new_cell_value):
                    array[rowi][coli] = None
                else:
                    array[rowi][coli] = new_cell_value
                    cell_value = new_cell_value
        else:  # cell value is not dict
            existing_value = get_in(reconstructed_object, base_path)
            if existing_value == cell_value:
                array[rowi][coli] = None

        cell_value = array[rowi][coli]

        # Update reconstructed object
        if isinstance(cell_value, dict) and bool(
            get_in(reconstructed_object, base_path)
        ):
            reconstructed_object = set_in(
                reconstructed_object,
                base_path,
                unflatten(
                    flatten(cell_value),
                    flatten(get_in(reconstructed_object, base_path)),
                ),
            )
        elif cell_value is not None:
            reconstructed_object = set_in(reconstructed_object, base_path, cell_value)
    return array
