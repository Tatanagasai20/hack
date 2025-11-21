FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Debug Vite binary permissions before build
RUN ls -l ./node_modules/.bin/vite
RUN chmod +x ./node_modules/.bin/vite
RUN ls -l ./node_modules/.bin/vite

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
