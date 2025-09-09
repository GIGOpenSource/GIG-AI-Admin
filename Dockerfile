FROM node:20-alpine

# Workdir
WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Vite dev server
ENV HOST=0.0.0.0
EXPOSE 5173

# Default command (can be overridden in compose)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
