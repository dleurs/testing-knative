# NodeJS - MongoDB on K8s
## Basic todo app, CRUD, coded in TypeScipt 

To setup Visual Studio Code for Nodejs with TypeScript, with autoreload and VSCode debugging (breakpoints) : <br/>
https://github.com/dleurs/learn_nodejs_ts


```bash
$ kubectl get pod
NAME                                      READY   STATUS    RESTARTS   AGE
my-release-mongodb-6d7b4d57cf-9jpgp       1/1     Running   0          17h
nodejs-mongodb-ovh-6cc66c978-2b9tc        1/1     Running   0          20m
```

```bash
$ kubectl get svc
NAME                     TYPE           CLUSTER-IP     EXTERNAL-IP                         PORT(S)        AGE
kubernetes               ClusterIP      10.3.0.1       <none>                              443/TCP        8d
my-release-mongodb       ClusterIP      10.3.146.86    <none>                              27017/TCP      17h
nodejs-mongodb-ovh-svc   LoadBalancer   10.3.183.150   6f985o6ikg.lb.c1.gra7.k8s.ovh.net   80:31861/TCP   19m
```
## Overview of the app :
![](./assets/Todo-app-presentation.png)

## How to use this repo?

- Create an account in OVH (or GCP)<br/>
https://www.ovh.com/manager/public-cloud/
- Go to Managed Kubernetes Service > Create a cluster > Add a basic node inside (like 1-2 vCPU - 7Go Ram or lower)
- Get the kubeconfig file and add elements to your ~/.kube/config
- 
```bash 
kubectl get node
NAME         STATUS   ROLES    AGE   VERSION
ovh-node-1   Ready    <none>   18h   v1.18.1
```

-
```bash 
git clone https://github.com/dleurs/nodejs-tsc-mongodb-on-k8s
cd nodejs-tsc-mongodb-on-k8s;
```

- Installing MongoDB on K8S
```bash
# https://github.com/bitnami/charts/tree/master/bitnami/mongodb
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-release bitnami/mongodb 
# or just : kubectl create -f k8s/1-mongodb-k8s.yaml
```
- Get mongoDB password
```bash
export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace default my-release-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)
echo $MONGODB_ROOT_PASSWORD
```
- Test the database, you may have to wait 
```bash
kubectl run --namespace default my-release-mongodb-client --rm --tty -i --restart='Never' --image docker.io/bitnami/mongodb:4.2.8-debian-10-r7 --command -- mongo admin --host my-release-mongodb --authenticationDatabase admin -u root -p $MONGODB_ROOT_PASSWORD
```
-
```bash
docker build . -t <yourdockeriopseudo>/nodejs-mongodb-todo-app:1.0.0
```
- 
```bash
docker push <yourdockeriopseudo>/nodejs-mongodb-todo-app:1.0.0
```
- Modify k8s/2-nodejs-deploy-svc.yaml
```bash
change lines :
# Put Docker IO Pseudo 
- image: <yourpseudo>/nodejs-mongodb-todo-app:1.0.0  
# Put database password
value: "mongodb://root:PASSWORD@my-release-mongodb.default.svc.cluster.local:27017/myProject?authSource=admin"  
``` 
-
```bash
kubectl create -f k8s/2-nodejs-deploy-svc.yaml
```
-
```bash
kubectl get pod
kubectl log nodejs-mongodb-123456
kubectl get svc
# Wait around 5 minuts for external IP
curl -v 123456.lb.c1.gra7.k8s.ovh.net
```


## Some command I used in this project 

helm install my-release bitnami/mongodb
export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace default my-release-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)

Wait for next command to work :
kubectl run --namespace default my-release-mongodb-client --rm --tty -i --restart='Never' --image docker.io/bitnami/mongodb:4.2.8-debian-10-r7 --command -- mongo admin --host my-release-mongodb --authenticationDatabase admin -u root -p $MONGODB_ROOT_PASSWORD

docker build -t dleurs/nodejs-mongodb-ovh:1.1.2 .

docker push dleurs/nodejs-mongodb-ovh:1.1.2

kubectl create k8s/deploy-and-loadbalancer.yaml

kubectl get svc

kubectl run --namespace default testing-nodejs-app --rm --tty -i --restart='Never' --image curlimages/curl --command -- curl -v 10.3.1.201

Wait for external IP
