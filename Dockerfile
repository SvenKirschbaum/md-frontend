FROM node:24.16.0-alpine@sha256:2bdb65ed1dab192432bc31c95f94155ca5ad7fc1392fb7eb7526ab682fa5bf14 as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.31.1-alpine-slim@sha256:8cd84e50babda9441af1e031faebd3fecd1e04b15071f5b6d290d6c2030293fc

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
