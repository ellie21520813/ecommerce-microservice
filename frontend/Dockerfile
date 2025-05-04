FROM node:18-alpine AS builder

WORKDIR /ecommerce
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


FROM nginx:alpine
COPY --from=builder /ecommerce/build /usr/share/nginx/html
COPY nginx/nginx_setup.conf /etc/nginx/conf.d/default.conf