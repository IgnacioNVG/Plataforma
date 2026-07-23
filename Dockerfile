# Dockerfile para Producción / Staging
# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Instalar pnpm globalmente y luego instalar dependencias
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Etapa 2: Producción
FROM node:20-alpine AS runtime

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Ejecutar el servidor Node.js generado por el adaptador SSR de Astro
CMD ["node", "./dist/server/entry.mjs"]
