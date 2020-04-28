import pytest
from jac_format import add

class TestCommonMath(object):
    
    def test_add(self):
        result = add(1,2)
        assert(result == 3)