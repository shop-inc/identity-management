FROM node:11.12-alpine

LABEL MAINTAINER="Dave Mathews <davenmathews@gmail.com>"
LABEL APPLICATION="Identity Management"

RUN mkdir /iam

WORKDIR /iam

COPY package.json /iam

RUN yarn install --production=true --no-lockfile

COPY dist /iam/dist

EXPOSE 50051
