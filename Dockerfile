<<<<<<< HEAD
# Build
FROM node:22-alpine AS builder
=======
# Build stage: compila NestJS (incluye devDependencies para @nestjs/cli y TypeScript).
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

>>>>>>> e472bb6b20173aa49faa7b6655436bbbcc783de4
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

<<<<<<< HEAD
COPY . .
RUN npm run build

# Producción
FROM node:22-alpine AS production
=======
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev

# Runtime: solo artefactos de producción.
FROM node:20-alpine AS runner

>>>>>>> e472bb6b20173aa49faa7b6655436bbbcc783de4
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
<<<<<<< HEAD
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 8080
ENV PORT=8080

=======
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app

EXPOSE 8080

USER node

>>>>>>> e472bb6b20173aa49faa7b6655436bbbcc783de4
CMD ["node", "dist/main.js"]
