FROM node:20.17.0-alpine@sha256:2d07db07a2df6830718ae2a47db6fedce6745f5bcd174c398f2acdda90a11c03 as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27.1-alpine-slim@sha256:f4064ca274f356bf19daff5d336dbcf825b11c313aa560d5be401785eb13f8ee

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
