# Testing Knative Serving


We are going to test Knative Serving with 4 differents functions :
1. A simple HelloWorld in NodeJS
2. A NodeJS / MongoDB CRUD app
3. A multiple calling pod functions : a pod calling md5, then sha1, then sha2, then sha... in NodeJS
4. A heavy calculation pod, calculating the xth prime number, in Flask

## How to use this repo ?

You need a Kubernetes cluster, I recommand using OVH as your k8s cloud provider, because they support lastest version of Kubernetes.
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami; 
helm install my-release bitnami/mongodb;
export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace default release-1-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode);
echo $MONGODB_ROOT_PASSWORD;
```
Wait a bit, then test that the database is running fine :
```bash
kubectl run --namespace default release-1-mongodb-client --rm --tty -i --restart='Never' --image docker.io/bitnami/mongodb:4.2.8-debian-10-r7 --command -- mongo admin --host release-1-mongodb --authenticationDatabase admin -u root -p $MONGODB_ROOT_PASSWORD
```
Copy/Paste the password into k8s/1-webview-nodejs-deploy-svc.yaml
```bash
- name: DBURL
  value: "mongodb://root:GOMy2VxWaH@my-release-mongodb.default.svc.cluster.local:27017/todoProject?authSource=admin"
```
```bash
cd webview-nodejs; 
docker build . -t <yourdockeriopseudo>/webview-nodejs:1.0.0
```
Copy/Paste the image name into k8s/1-webview-nodejs-deploy-svc.yaml
```bash
      containers:
      - image: dleurs/webview-nodejs:1.0.0
```

```bash
kubectl create -f k8s/1-webview-nodejs-deploy-svc.yaml
```

```bash
```