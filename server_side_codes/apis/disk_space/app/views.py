from app import app
import shutil
from flask import jsonify


@app.route("/")
def home():
    return "hello world!"


@app.route("/diskspace")
def disk_space():
    # Path
    path = "./"

    # Get the disk usage statistics
    # about the given path
    (total, used, free) = shutil.disk_usage(path)

    # Print disk usage statistics
    # print("Disk usage statistics:")
    disk_space = {}
    disk_space["total"] = f"{total/1e9:.2f} GB"
    disk_space["used"] = f"{used/1e9:.2f} GB"
    disk_space["free"] = f"{free/1e9:.2f} GB"
    disk_space["precentage_free"] = f"{100*free/total:.2f}%"

    resp = jsonify(disk_space)
    resp.status_code = 200
    return resp
