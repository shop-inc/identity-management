#!/bin/bash

yarn db:seed:dev
yarn ts:watch > /dev/null &
yarn start:dev