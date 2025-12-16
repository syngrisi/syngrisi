FROM node:22.19.0-alpine

ARG SY_VERSION=latest
ENV SY_VERSION=${SY_VERSION}

WORKDIR /usr/src/syngrisi

RUN apk add --no-cache rsync mongodb-tools git && \
    npm init sy@${SY_VERSION} /usr/src/syngrisi -- --yes --force
