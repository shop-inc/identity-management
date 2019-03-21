FROM node:11.12-alpine

LABEL MAINTAINER="Ian Duncan <ianduncan08@gmail.com>"

RUN mkdir /iam

WORKDIR /iam

RUN apk update && apk upgrade && \
  npm install -g yarn@1.15.x && rm -rf package-lock.json

COPY package.json /iam
COPY yarn.lock /iam

RUN yarn install
