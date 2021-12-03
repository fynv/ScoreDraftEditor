from setuptools import setup

setup(
        name = 'scoredraft_editor',
        version = '0.0.4',
        description = 'Commandline Utilities for ScoreDraftEditor',     
        url='https://github.com/fynv/ScoreDraftEditor',
        license='MIT',
        author='Fei Yang, Vulcan Eon, Beijing',
        author_email='hyangfeih@gmail.com',
        keywords='synthesizer audio music utau psola',
        packages=['scoredraft_editor'], 
        install_requires = ['scoredraft>=1.0.6'],
        entry_points={
        'console_scripts': [
            'scoredraft_sys_detect=scoredraft_editor:sys_detect',
            'scoredraft_build_pdf=scoredraft_editor:build_pdf',
            'scoredraft_build_demo=scoredraft_editor:build_demo'         
        ]
    }
)


