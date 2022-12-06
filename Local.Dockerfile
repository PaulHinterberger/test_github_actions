FROM node:lts-alpine as node

RUN apk update && apk add python3 && apk add make && apk add build-base

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm ci
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm run docker   

# Stage 2
FROM nginx:alpine
COPY --from=node /usr/src/app/www/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf