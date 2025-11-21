# ==== BUILDER ====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code and configs
COPY . .

# Fix executable permission on actual Vite JS file
RUN chmod +x ./node_modules/vite/bin/vite.js

# Build the app (bypassing symlink confusion by calling node directly)
RUN node ./node_modules/vite/bin/vite.js build

# ==== FINAL ====
FROM nginx:alpine

# Copy built static files to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
