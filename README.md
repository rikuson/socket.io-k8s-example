# socket.io-k8s-example

## Prerequisites

- [Helm](https://helm.sh) is installed
- ingress-controller is installed

If you are using Docker Desktop, you can install ingress-nginx as ingress-controller by following [quick start](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start).

```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

## Installation

```bash
docker-compose build
helm upgrade --install example infra
```

## Uninstallation

```bash
docker-compose down --rmi all --volumes --remove-orphans
helm uninstall example
```
