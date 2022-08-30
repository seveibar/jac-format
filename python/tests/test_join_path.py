import pytest
from jac_format import join_path

class TestJoinPath(object):
    
    def test_join_path1(self):
        assert(join_path("samples.0", "output") == "samples.0.output")
        
    def test_join_path2(self):
        assert(join_path("samples.0.", ".output") == "samples.0.output")
        
    def test_join_path3(self):
        assert(join_path("samples.0", ".output") == "samples.0.output")
        
    def test_join_path4(self):
        assert(join_path("samples.0.", "output") == "samples.0.output")
        
    def test_join_path5(self):
        assert(join_path(".", "output") == "output")
        
    def test_join_path6(self):
        assert(join_path("output", ".") == "output")
        
    def test_join_path7(self):
        assert(join_path(".", ".") == ".")