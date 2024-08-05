FROM node:21-alpine3.18

WORKDIR /usr/src/syngrisi

RUN apk add --no-cache rsync mongodb-tools && \
    npm init sy@latest /usr/src/syngrisi -- --yes --force
