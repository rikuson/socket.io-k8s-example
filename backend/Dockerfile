FROM --platform=linux/amd64 node:16.13-slim

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

ENV REDIS_URL "redis://kvs:6379"
ENV REDIS_PASSWORD ""

COPY . /app
WORKDIR /app
RUN npm ci
CMD ["node", "index"]
