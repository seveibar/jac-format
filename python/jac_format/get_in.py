import re


def get_in_array_path(d, path):
    if d is None:
        return None
    if len(path) == 0:
        return d
    if isinstance(d, list):
        if not isinstance(path[0], int):
            return None
        if path[0] >= len(d):
            return None
        return get_in_array_path(d[path[0]], path[1:])
    else:
        return get_in_array_path(d.get(path[0], None), path[1:])


def get_in(d, path):
    path = re.sub(r"\[([0-9]+)\]", r".\1", path)
    path = [int(seg) if seg.isdigit() else seg for seg in path.split(".")]
    return get_in_array_path(d, path)


if __name__ == "__main__":
    assert get_in([{"b": [None, "c"]}], "0.b.1") == "c"
    assert a[0]["b"][1] == "c"
