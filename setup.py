from setuptools import setup, find_packages
import os

version = '1.0'

long_description = (
    open('README.rst').read()
    + '\n' +
    open('CHANGES').read()
    + '\n')

setup(name='oerpub.rhaptoslabs.cnxml2htmlpreview',
      version=version,
      description="HTML previewer for cnxml.",
      long_description=long_description,
      # Get more strings from
      # http://pypi.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
        "Programming Language :: Python",
        ],
      keywords='',
      author='Marvin Reimer',
      author_email='',
      url='https://github.com/oerpub/oerpub.rhaptoslabs.cnxml2htmlpreview',
      license='gpl',
      packages=find_packages('src'),
      package_dir = {'': 'src'},
      namespace_packages=['oerpub', 'oerpub.rhaptoslabs'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
          'libxml2-python',
          'rhaptos.cnxmlutils',
      ],
      entry_points="""
      # -*- Entry points: -*-
      """,
      )
