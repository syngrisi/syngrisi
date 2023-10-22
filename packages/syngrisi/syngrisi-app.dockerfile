FROM node:14.20.0-alpine3.16

WORKDIR /usr/src/syngrisi

RUN apk add --no-cache rsync mongodb-tools && \
    npm init sy@latest /usr/src/syngrisi -- --yes --force
