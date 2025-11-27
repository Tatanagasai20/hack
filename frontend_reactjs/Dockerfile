# ==== BUILDER ====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build using the standard npm script (cleanest & most reliable)
RUN npm run build
# This automatically uses Vite — no need to chmod or call vite.js manually

# ==== FINAL ====
FROM nginx:alpine

# Copy only the built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: better security (remove default nginx page)
RUN rm /etc/nginx/conf.d/default.conf 2>/dev/null || true

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
