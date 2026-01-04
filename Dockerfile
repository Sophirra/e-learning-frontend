# Dockerfile dla trybu development
FROM node:20-alpine

# Zainstaluj curl dla healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Kopiuj package.json i package-lock.json z e-learning-frontend
COPY package.json package-lock.json* ./

# Zainstaluj zeleżności
RUN if [ -f package-lock.json ]; then \
      echo "Found package-lock.json, using npm ci"; \
      npm ci; \
    else \
      echo "No package-lock.json found, using npm install"; \
      npm install; \
    fi

# Skopiuj wszystkie pliki  z e-learning-frontend
COPY . .

# Expose port dla Vite dev server
EXPOSE 5173

# Uruchom Vite dev server
CMD ["npm", "run", "dev"]


