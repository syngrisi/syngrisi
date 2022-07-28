FROM node:14.20.0-alpine3.16

WORKDIR /usr/src/syngrisi

ENV PYTHONUNBUFFERED=1

COPY ./package*.json ./

# 1. node canvas
RUN apk  --no-cache --virtual .canvas-build-deps add \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    && apk --no-cache add \
    pixman \
    cairo \
    pango \
    giflib \
    && apk add --no-cache --virtual .gyp  \
    && apk add --no-cache --virtual .python \
    && apk add --no-cache --virtual .make \
    && apk add --no-cache --virtual .g++ \
    && npm install canvas --build-from-source\
    && apk del .gyp \
    # 2. mongodb-tools && rsync \
    && apk add rsync \
    && apk add mongodb-tools \
    # 3. npm install \
    && npm install

COPY . ./
