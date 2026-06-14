# Imagen base — Node 20 versión ligera
FROM node:20-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia primero package.json para aprovechar caché de Docker
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Puerto que expone el backend
EXPOSE 3000

# Comando para iniciar
CMD ["node", "src/server.js"]