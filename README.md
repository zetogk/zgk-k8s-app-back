# zgk-k8s-app-back
Project only for practising Kubernetes

## How to run in Docker
```
docker run -p 8000:8000 -e MONGO_URL="mongodb://<user>:<password>@<host>:<port>/zgk-k8s-app-back" zgk-k8s-app-back
```

## Testing

### LIVENESS (:v2)
* You can tests the Liveness HTTP probe doing request to GET localhost:8000/liveness-health
* You can destroy the server app doing a request to POST localhost:8000/liveness-destroy-health

### READINESS (:v2)
* You can use the endpoint GET localhost:8000/readiness-health. The app simulates 30 seconds for loading components.

### FILES (:v3)
* The endpoint `POST /plans` create files