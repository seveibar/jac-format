import re


def set_in_path_array(d, path, val, prev_path=[]):
    if len(path) == 0:
        return val

    seg = path[0]

    if seg.isdigit() and not (isinstance(d, list) or d is None):
        raise ValueError(
            "Path didn't lead to list, but was being indexed like a list {}".format(
                ".".join(prev_path)
            )
        )
    if seg.isdigit():
        seg = int(seg)
        if d is None:
            d = []

    if d is None:
        d = {}

    if len(path) == 1:
        if isinstance(seg, int):
            while len(d) <= seg:
                d.append(None)
            d[seg] = val
            return d
        else:
            d[seg] = val
            return d
    else:  # len(path) > 1
        if isinstance(d, list):
            while len(d) <= seg:
                d.append(None)
            d[seg] = set_in_path_array(d[seg], path[1:], val, prev_path + [seg])
        else:
            d[seg] = set_in_path_array(
                d.get(seg, None), path[1:], val, prev_path + [seg]
            )
        return d


def set_in(d, path, val):
    path = re.sub(r"\[([0-9]+)\]", r".\1", path)
    return set_in_path_array(d, path.split("."), val)


if __name__ == "__main__":
    a = {}
    a = set_in(a, "b.c", "d")
    assert a["b"]["c"] == "d"

    a = []
    a = set_in(a, "0.b.1", "c")
    assert a[0]["b"][1] == "c"

    a = {}
    a = set_in(a, "b[1].c", "d")
    assert a["b"][1]["c"] == "d"
