ARG NODE_VERSION=22.16.0

FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

FROM alpine AS base
RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune api --docker

FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

RUN --mount=type=cache,target=~/.pnpm-store \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN turbo build --filter=api
RUN --mount=type=cache,target=~/.pnpm-store \
    pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

FROM alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

ENV PORT=3001
ENV NODE_ENV=production

COPY --from=builder --chown=nestjs:nodejs /app .

EXPOSE 3001

CMD ["node", "apps/api/dist/main"]