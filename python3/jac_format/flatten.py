from set_in import set_in


def flatten(orig_dict, path_prefix=""):
    print(path_prefix, orig_dict)
    flat_dict = {}

    if isinstance(orig_dict, list):
        for index, item in enumerate(orig_dict):
            if item is None:
                continue
            if isinstance(item, list) or isinstance(item, dict):
                flat_dict.update(flatten(item, path_prefix + str(index) + "."))
            else:
                flat_dict[path_prefix + str(index)] = item
    elif isinstance(orig_dict, dict):
        for key, value in orig_dict.items():
            if value is None:
                continue
            if isinstance(value, list) or isinstance(value, dict):
                flat_dict.update(flatten(value, path_prefix + key + "."))
            else:
                flat_dict[path_prefix + key] = value
    else:
        raise ValueError("Invalid Type for flatten, needs to be list or dict")

    return flat_dict


if __name__ == "__main__":
    assert flatten({"a": 1})["a"] == 1
    assert flatten({"a": [None, 2]})["a.1"] == 2
    assert flatten({"a": [None, {"b": 3}]})["a.1.b"] == 3
