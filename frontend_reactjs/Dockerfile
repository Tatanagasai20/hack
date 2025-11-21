# ==== BUILDER ====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first (best caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the app (no permission issues, no missing native rollup)
RUN npm run build

# ==== FINAL ====
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
