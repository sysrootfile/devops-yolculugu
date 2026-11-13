# DevOps Yolculuğu — production imajı
# Referans implementasyon: Seviye 3 / dockerfile-ve-imaj dersinde adım adım anlatılır.

# 1. Aşama: siteyi derle (builder)
FROM node:22-alpine AS builder
WORKDIR /app

# bağımlılık tanımlarını önce kopyala (katman cache'i için!)
COPY package.json package-lock.json ./
RUN npm ci

# kaynak kodu kopyala ve derle
COPY . .
RUN npm run build

# 2. Aşama: yalnızca üretilen dosyaları taşı (minimal çalışma imajı)
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
