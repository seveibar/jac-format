from setuptools import setup, find_packages


with open('README.md') as f:
    readme = f.read()

with open('../LICENSE') as f:
    license = f.read()

setup(
    name='jac_format',
    version='0.1.0',
    description='JAC (JSON as CSV) Format Conversion',
    long_description=readme,
    author='UniversalDataTool',
    author_email='info@workaround.online',
    url='https://github.com/UniversalDataTool/jac-format',
    license=license,
    packages=find_packages(exclude=('tests', 'docs'))
)