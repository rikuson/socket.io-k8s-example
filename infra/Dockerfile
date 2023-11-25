FROM node:16.13-slim

ENV REDIS_URL "redis://kvs:6379"

RUN apt-get update -y && apt-get install -y git
RUN git clone --depth 1 https://github.com/rikuson/pubsub-sample /app
WORKDIR /app
RUN npm ci
ENTRYPOINT ["node", "./bin/www"]
