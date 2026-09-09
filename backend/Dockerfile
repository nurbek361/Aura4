FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY artifacts/api-server/package.json artifacts/api-server/package.json
COPY lib lib
COPY artifacts/api-server artifacts/api-server
RUN corepack enable && pnpm install --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 5000
CMD ["pnpm", "--filter", "@workspace/api-server", "run", "dev"]