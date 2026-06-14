FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Puerto de Vite para desarrollo
EXPOSE 5173

# Inicia Vite en modo desarrollo, permitiendo conexiones externas
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]