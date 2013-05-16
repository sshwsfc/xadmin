#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    PROJECT_ROOT = os.path.realpath(os.path.dirname(__file__))
    sys.path.insert(0, os.path.join(PROJECT_ROOT, os.pardir))

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "demo.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
