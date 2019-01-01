# zgk-k8s-app-back
Project only for practising Kubernetes

## How to run in Docker
```
docker run -p 8000:8000 -e MONGO_URL="mongodb://<user>:<password>@<host>:<port>/zgk-k8s-app-back" zgk-k8s-app-back
```