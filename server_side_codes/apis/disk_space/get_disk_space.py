
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
print(f"Total {total/1e9: 0.2f} GB, Used {used/1e9: 0.2f} GB, Free {free/1e9: 0.2f} GB, Free percentage {100*free/total: 0.2f}%")