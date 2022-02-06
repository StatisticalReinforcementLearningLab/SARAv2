### How to run the docker image

Install and run the docker. A microservice with the name `sara_sleep_self_monitoring` will start.
```
sudo bash start.sh
```

Start and remove the docker image if you want to change anythinng
```
sudo docker stop sara_sleep_self_monitoring
sudo docker rm sara_sleep_self_monitoring
```


Seeing the log files of the docker
```
docker logs --tail=50 sara_sleep_self_monitoring
```

### How to access a sleep graph for a specific user
- Install postman for here https://www.postman.com/
- Create a get request with the json addendum like the image shown below. If you need to change the port number, then change the `start.sh` files.

<img width="788" alt="sleep_graph_input" src="https://user-images.githubusercontent.com/1216420/131237919-e0dd511e-6725-4bff-b8ed-d6129692abae.png">
