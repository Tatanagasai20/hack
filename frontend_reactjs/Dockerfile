# ==== BUILDER ====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (devDependencies are REQUIRED for Vite build)
RUN npm ci

# Copy source code
COPY . .

# THIS IS THE ONLY LINE THAT FIXES "Permission denied" forever
RUN apk add --no-cache bash

# Build the app — now works perfectly
RUN npm run build

# ==== FINAL ====
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
