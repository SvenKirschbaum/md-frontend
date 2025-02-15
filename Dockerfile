FROM node:22.14.0-alpine@sha256:f96abbefa5558bcf3a309a5da9e1e9bd6dece7704b895c1213ca62f245061d3f as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27.4-alpine-slim@sha256:d806155689f8220eb4c4bc7a6ac643829a5944ab522ec6e4d97f17e065f3dc71

RUN echo -e "\
server_tokens off;\
server {\
    listen       80;\
    location / {\
        root   /usr/share/nginx/html;\
        index  index.html;\
        try_files \$uri /index.html;\
    }\
}\
" > /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY --from=build /build/build ./
