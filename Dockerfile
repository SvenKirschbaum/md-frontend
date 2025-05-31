FROM node:22.16.0-alpine@sha256:fa5f57793a2553cd6d40ef234d8f51c4c1df73284f14acf877e36bb7801d257c as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.28.0-alpine-slim@sha256:39a9a15e0a81914a96fa9ffa980cdfe08e2e5e73ae3424f341ad1f470147c413

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
