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

# Build for production
RUN npm run build-only

####################
# Runtime: Preview #
####################
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy built assets and necessary files
COPY --from=builder /app/dist /app/dist
COPY package*.json ./
RUN npm ci --omit=dev

ENV HOST=0.0.0.0
EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
