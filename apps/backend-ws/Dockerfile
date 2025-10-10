FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

COPY ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ../../package.json ./
COPY ../../packages ./packages
COPY . ./apps/backend-ws

RUN pnpm install --filter backend-ws... --frozen-lockfile
RUN pnpm -w turbo run build --filter backend-ws

ENV NODE_ENV=production
ENV WS_PORT=8080
WORKDIR /app/apps/backend-ws
EXPOSE 8080
CMD ["node", "dist/index.js"]


