FROM node:22.11.0-alpine@sha256:f265794478aa0b1a23d85a492c8311ed795bc527c3fe7e43453b3c872dcd71a3 as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27.2-alpine-slim@sha256:e9293c9bedb0db866e7d2b69e58131db4c2478e6cd216cdd99b134830703983a

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
