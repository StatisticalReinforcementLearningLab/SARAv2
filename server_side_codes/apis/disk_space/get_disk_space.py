
# Python program to explain shutil.disk_usage() method 
    
# importing shutil module 
import shutil
  
# Path
path = "./"
  
# Get the disk usage statistics
# about the given path
(total, used, free) = shutil.disk_usage(path)
  
# Print disk usage statistics
print("Disk usage statistics:")
print(f"{total/1e9} GB, {used/1e9} GB, {free/1e9} GB, {100*free/total}%")