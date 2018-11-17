FROM node:11.1

ADD ./package.json /usr/api/package.json
ADD ./yarn.lock /usr/api/yarn.lock
ADD ./tsconfig.json /usr/api/tsconfig.json
ADD ./src/ /usr/api/src/

WORKDIR /usr/api/

RUN yarn

