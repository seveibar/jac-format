def set_in():
    pass


a = {}
set_in(a, "b.c", "d")
assert(a["b"]["c"] == "d")