FROM node:20.13.1-alpine@sha256:291e84d956f1aff38454bbd3da38941461ad569a185c20aa289f71f37ea08e23 as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.26.0-alpine-slim@sha256:be13c98f606eef87521627d5c794a98ac1e5a8fcb085e75acdc0c9d66a28666c

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
