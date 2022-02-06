from setuptools import setup, find_packages
setup(name='sara',
version='0.1.1',
description='general python package for sara related tasks',
packages=['sara', 'sara.parsers', 'sara.connectors'],
package_data={'sara':['config/*','node/*', 'node/node_modules/*']},
url='#',
author='Eura',
author_email='eurashin@g.harvard.edu',
install_requires=[
    'boto3', 
    'mysql-connector-python',
    'pandas',
    'prettytable'
    ],
zip_safe=False)
