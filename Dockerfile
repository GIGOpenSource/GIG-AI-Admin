##########
# Builder #
##########
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better cache)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# Build-time configuration for Vite
# You can override at build with: --build-arg VITE_API_BASE_URL=/api
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build for production (static assets in /app/dist)
RUN npm run build-only

####################
# Runtime: Nginx Static #
####################
FROM nginx:alpine AS runner

# Copy Nginx config and built assets
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
