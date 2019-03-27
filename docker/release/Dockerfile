FROM node:11.12-alpine

LABEL MAINTAINER="Dave Mathews <davenmathews@gmail.com>"
LABEL APPLICATION="Identity Management"

RUN mkdir /iam

WORKDIR /iam

RUN apk update && apk upgrade && \
  npm install -g yarn@1.15.x && rm -rf package-lock.json

COPY package.json /iam
COPY yarn.lock /iam

RUN yarn install --production

COPY dist /iam/dist

EXPOSE 50051
