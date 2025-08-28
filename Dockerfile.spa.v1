ARG BUILD_COMMAND=generate
ARG ENV_FILE_PATH=./env/.env.production

# 使用 node 長期支援版
FROM node:20-slim AS build
LABEL stage=build
LABEL project=camelot
ARG BUILD_COMMAND

# corepack is an experimental feature in Node.js v20 which allows
# installing and managing versions of pnpm, npm, yarn
RUN corepack enable

VOLUME [ "/pnpm-store", "/app/node_modules" ]
RUN pnpm config --global set store-dir /pnpm-store

# 設定工作目錄
WORKDIR /app

COPY . .

# 如果有複製本機的node_modules會發生錯誤
# 需配置.dockerignore避免複製node_modules
RUN pnpm i
RUN pnpm $BUILD_COMMAND

FROM steebchen/nginx-spa:stable
LABEL project=camelot

COPY --from=build ./app/.output/public/ ./app

EXPOSE 80

CMD ["nginx"]

# how to build: docker build -t $image_tag .
# how to run image: docker run -p 8000:80 $image_tag
