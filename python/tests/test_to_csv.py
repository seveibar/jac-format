import pytest
from jac_format.to_csv import to_csv


class TestToCSV(object):
    def test_to_csv(self):

        csvstring = to_csv(
            {"fruits": [{"color": "red"}], "veggies": [None, {"vitamins": "B"}]},
            columns=[".", "color", ".vitamins"],
            rows=["fruits.0", "veggies[1]"],
        )

        print(csvstring)

        expected_csv = """path,.,color,.vitamins
fruits.0,,red,
veggies[1],,,B""".strip()

        assert csvstring.replace("\r", "").strip() == expected_csv
