# Imagen base ligera
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo package.json y package-lock.json
COPY package*.json ./

RUN npm install -g @nestjs/cli

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto del backend
EXPOSE 3000

# Comando para desarrollo con hot reload
CMD ["npm", "run", "start:dev"]
