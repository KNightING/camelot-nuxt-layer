# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=26-alpine

FROM node:${NODE_VERSION} AS base
LABEL stage=build
ARG PNPM_VERSION=11.25.0
ENV PNPM_HOME="/pnpm" \
  PATH="/pnpm:$PATH" \
  CI=true
# Keep in sync with the pnpm version used locally, so the build resolves the
# lockfile exactly as developers do.
# Installed via npm rather than corepack: corepack is no longer shipped in the
# Node images from 25 onwards, so `corepack enable` is not found on node 26.
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app

FROM base AS deps
LABEL stage=build
# .npmrc is required: it sets shamefully-hoist=true, without which `vue` is not
# at node_modules/vue and Rollup cannot resolve it from unplugin-icons' virtual
# `~icons/*` modules during `nuxt build`.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# --trust-lockfile skips pnpm 11 re-validating every lockfile entry against
# minimumReleaseAge (default 24h), which would abort the build on a dependency
# published shortly before it. The lockfile is resolved locally under that
# policy and reviewed, so it is the trusted base here.
RUN pnpm install --frozen-lockfile --ignore-scripts --trust-lockfile

FROM base AS build
LABEL stage=build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM node:${NODE_VERSION} AS runner
LABEL stage=build
ENV NODE_ENV=production \
  NITRO_PORT=8080 \
  NITRO_HOST=0.0.0.0 \
  PORT=8080
WORKDIR /app

COPY --from=build /app/.output ./.output

USER node
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
