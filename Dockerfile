FROM node:22.11.0-alpine@sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763e as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27.3-alpine-slim@sha256:c21b5407a5538e72152ae2b221495a5348ee7bc8bd80720aac62206dd65a4579

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
