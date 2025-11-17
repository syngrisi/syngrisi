FROM node:21-alpine3.18

ARG SY_VERSION=latest
ENV SY_VERSION=${SY_VERSION}

WORKDIR /usr/src/syngrisi

RUN apk add --no-cache rsync mongodb-tools && \
    npm init sy@${SY_VERSION} /usr/src/syngrisi -- --yes --force
