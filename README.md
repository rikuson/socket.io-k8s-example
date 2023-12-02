# socket.io-k8s-example

## Prerequisites

- [Helm](https://helm.sh) is installed

## Installation

```bash
docker compose build
helm dependency build infra
helm upgrade --install example infra
```

Run `docker compose up frontend` and open http://localhost .

## Uninstallation

```bash
docker compose down --rmi all --volumes --remove-orphans
helm uninstall example
```
