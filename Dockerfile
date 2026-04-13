# Build stage: compila NestJS (incluye devDependencies para @nestjs/cli y TypeScript).
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev

# Runtime: solo artefactos de producción.
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app

EXPOSE 8080

USER node

CMD ["node", "dist/main.js"]
