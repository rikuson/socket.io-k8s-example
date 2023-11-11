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
helm upgrade --install example .
```

## Uninstallation

```bash
helm uninstall example
```
