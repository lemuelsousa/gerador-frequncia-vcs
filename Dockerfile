FROM node:18-slim AS build

WORKDIR /app

# Install dependencies (including dev) for building
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Install LibreOffice (required by libreoffice-convert). Using meta package for reliability.
RUN apt-get update && \
    apt-get install -y --no-install-recommends libreoffice && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built artifacts
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/views ./views

EXPOSE 3000

CMD ["npm", "run", "start"]
