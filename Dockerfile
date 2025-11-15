FROM node:24.11.1-alpine@sha256:2867d550cf9d8bb50059a0fff528741f11a84d985c732e60e19e8e75c7239c43 as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.29.3-alpine-slim@sha256:4c175d0d849aae0e0eedc64d718ef6323bed2bc68ee673e2d0a1bd5d501d0e5f

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
