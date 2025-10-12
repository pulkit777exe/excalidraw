FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

COPY ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ../../package.json ../../turbo.json ./
COPY ../../packages ./packages
COPY . ./apps/backend-http

RUN pnpm install --filter backend-http... --frozen-lockfile
RUN pnpm dlx turbo run build --filter backend-http

ENV NODE_ENV=production
WORKDIR /app/apps/backend-http
EXPOSE 3008
CMD ["node", "dist/index.js"]


