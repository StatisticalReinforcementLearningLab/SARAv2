import os

docker_names = os.system('docker container ls --format \'table {{.Names}}\'')

print(type(docker_names))
print(docker_names)
