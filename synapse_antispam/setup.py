from setuptools import setup, find_packages

setup(
    name="mjolnir",
    version="1.82.0", # version automated in package.json - Do not edit this line, use `yarn version`.
    packages=find_packages(),
    description="Mjolnir Antispam",
    include_package_data=True,
    zip_safe=True,
    install_requires=[],
)
