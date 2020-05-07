import pytest
from jac_format.remove_redundancies import remove_redundancies


class TestRemoveRedundancies(object):
    def test_remove_redundancies(self):

        rows = ["fruits.0", "veggies[1]"]
        columns = [".", ".color", ".vitamins"]
        arrayToBeMutated = [
            ["path", ".", "color", ".vitamins"],
            ["fruits.0", {"color": "red"}, "red", None],
            ["veggies[1]", {"vitamins": "B"}, None, "B"],
        ]

        correctArray = [
            ["path", ".", "color", ".vitamins"],
            ["fruits.0", None, "red", None],
            ["veggies[1]", None, None, "B"],
        ]

        assert (
            remove_redundancies(rows=rows, columns=columns, array=arrayToBeMutated)
            == correctArray
        )
