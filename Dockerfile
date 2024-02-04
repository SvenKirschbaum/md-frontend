FROM node:20.11.0-alpine@sha256:9b61ed13fef9ca689326f40c0c0b4da70e37a18712f200b4c66d3b44fd59d98e as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.25.3-alpine-slim@sha256:4b4bc9f88bd63fb3abc8fd4f5ad7f16554589ca1fca8d3a53416ff55b59b6f80

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
