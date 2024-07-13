FROM node:20.15.1-alpine@sha256:34b7aa411056c85dbf71d240d26516949b3f72b318d796c26b57caaa1df5639a as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27.0-alpine-slim@sha256:66943ac4a1ca7f111097d3c656939dfe8ae2bc8314bb45d6d80419c5fb25e304

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
