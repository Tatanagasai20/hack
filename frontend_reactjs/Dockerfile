# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Ensure package-lock.json exists
COPY package.json package-lock.json ./

# Install dependencies including devDependencies (Vite)
RUN npm install

# Copy rest of project
COPY . .

# Build
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
