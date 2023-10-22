FROM node:14.20.0-alpine3.16

WORKDIR /usr/src/syngrisi

ENV PYTHONUNBUFFERED=1

# mongodb-tools && rsync
RUN apk add --no-cache rsync mongodb-tools

# install dependencies
COPY package*.json ./
RUN npm install

# copy source
COPY . ./


# FROM node:14.20.0-alpine3.16
#
# WORKDIR /usr/src/syngrisi
#
# ENV PYTHONUNBUFFERED=1
#
# # COPY ./package*.json ./
#
# COPY . ./
#
#      # 1. mongodb-tools && rsync \
# RUN apk add rsync \
#     && apk add mongodb-tools \
#     # 2. npm install \
#     && npm install
#
