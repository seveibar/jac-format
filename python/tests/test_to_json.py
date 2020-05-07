import pytest
from jac_format import to_json

class TestToJSON(object):
    
    def test_to_json_1(self):
        result = to_json("""path,.,.color,.vitamins
fruits.0,,red,
veggies.1,,,B""")
        assert(result == {
            "fruits": [{ "color": "red" }],
            "veggies": [None, { "vitamins": "B" }]
        })