#!/usr/local/bin/python3
from app import app
from flask import jsonify
@app.route('/')
def index():
    return jsonify({'message': 'Hello, World!'})
