import sys

# importing shutil module
import shutil

from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello():
    version = "{}.{}".format(sys.version_info.major, sys.version_info.minor)
    message = "Hello World from Flask in a uWSGI Nginx Docker container with Python {} (default)".format(
        version
    )
    return message


@app.route("/getdiskspace")
def get_disk_space():
    # Path
    path = "./"

    # Get the disk usage statistics
    # about the given path
    (total, used, free) = shutil.disk_usage(path)

    # Print disk usage statistics
    # print("Disk usage statistics:")
    message = f"Total {total/1e9: 0.2f} GB, Used {used/1e9: 0.2f} GB, Free {free/1e9: 0.2f} GB, Free percentage {100*free/total: 0.2f}%"
    return message


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=80)
