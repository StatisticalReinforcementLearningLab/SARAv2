from setuptools import setup, find_packages
setup(name='backend',
version='0.1.1',
description='Back-end pipeline',
packages=['visualization', 'parsers'],
package_data={'visualization':['data/config/*']},
url='#',
author='Eura',
author_email='eurashin@g.harvard.edu',
zip_safe=False)
