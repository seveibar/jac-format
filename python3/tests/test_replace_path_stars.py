import pytest
from jac_format import replace_path_stars

test_paths = [
  "interface",
  "samples.*",
  "samples.*",
  "samples.*",
  "output.*",
  "output.*",
  "metadata",
]

class TestReplacePathStars(object):
    
    def test_replace_path_stars_1(self):
        
        result = replace_path_stars(test_paths)
            
        assert(result == [
          "interface",
          "samples.0",
          "samples.1",
          "samples.2",
          "output.0",
          "output.1",
          "metadata",
        ])
        
