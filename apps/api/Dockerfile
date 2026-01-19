FROM node:20-slim

# 🔑 Instalar OpenSSL
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
CMD wget -qO- http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
