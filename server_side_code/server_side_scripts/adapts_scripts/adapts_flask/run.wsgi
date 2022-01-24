#!/usr/local/bin/python3
import logging
import sys
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '/data/html/flask-jwt/')
from run import app as application
#application.secret_key = 'anything you wish'
