# Running the FLASK server in Docker
Make sure you have docker [installed](https://docs.docker.com/get-docker/)!

1. Clone the git repository: `git clone`
2. Move the "sara-flask-app" into your /var/www/ directory to run it from your local (or remote) server IP 
3. Go into the sara-flask-app directory
4. Make the bash script executable: `sudo chmod +x start.sh`
5. Run the script to install the Docker image and run the container: `sudo bash ./start.sh`
6. Check that your docker image is running (this should have an Image named 'sara.flask'): `docker ps`

## Some helpful commands: 
`sudo docker stop sara.flask`
`sudo docker rm sara.flask`
`sudo bash start.sh`
`sudo docker start sara.flask`
`docker logs --tail=50 sara.flask`
`docker ps`

# Interacting with the server
Test it out! 
Our public IP is http://54.146.43.246
You can go to this directly to see the "hello world" output.
You can send a POST request to http://54.146.43.246/login
With the following fields in the body:
username: test
password: password

