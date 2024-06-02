FROM node:20.14.0-alpine@sha256:928b24aaadbd47c1a7722c563b471195ce54788bf8230ce807e1dd500aec0549 as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27.0-alpine-slim@sha256:3e9fb1e3981db06e79f214d685748b74df38f9b50ca439438a095c1316231707

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
