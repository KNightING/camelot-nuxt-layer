# 使用 node 長期支援版
FROM node:21-slim AS build
LABEL stage=build

# corepack is an experimental feature in Node.js v20 which allows
# installing and managing versions of pnpm, npm, yarn
RUN corepack enable

# VOLUME [ "/pnpm-store", "/app/node_modules" ]
# RUN pnpm config --global set store-dir /pnpm-store

# 設定工作目錄
WORKDIR /app

COPY . .

RUN pnpm i
RUN pnpm run build

FROM node:21-alpine

WORKDIR /app
COPY --from=build /app/.output ./.output

# node --env-file need version 20.6 or higher
EXPOSE 8080
# CMD ["sh", "-c", "NITRO_PORT=8080 node --env-file=.env .output/server/index.mjs"]
CMD ["sh", "-c", "NITRO_PORT=8080 node .output/server/index.mjs"]

# default port 3000
# EXPOSE 3000
# CMD ["node", ".output/server/index.mjs"]
