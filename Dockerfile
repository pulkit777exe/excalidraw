FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps ./apps
RUN pnpm install --frozen-lockfile

FROM deps AS build
ENV NODE_ENV=production
RUN pnpm turbo run build --filter=... 

FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
ENV NODE_ENV=production
COPY --from=build /app .

CMD ["pnpm", "-w", "-s", "-C", ".", "-r", "run", "start"]


