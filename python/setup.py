from path import join
from setuptools import setup, find_packages


with open(join(__dirname, "../README.md")) as f:
    readme = f.read()

with open(join(__dirname, "../LICENSE")) as f:
    license = f.read()

setup(
    name="jac_format",
    version="0.1.0",
    description="JAC (JSON as CSV) Format Conversion",
    long_description=readme,
    long_description_content_type="text/markdown",
    author="UniversalDataTool",
    author_email="seve@wao.ai",
    url="https://github.com/UniversalDataTool/jac-format",
    license=license,
    packages=["jac_format"],
    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Intended Audience :: Science/Research",
        "Programming Language :: Python :: 2.7",
        "Programming Language :: Python :: 3.6",
    ],
)
