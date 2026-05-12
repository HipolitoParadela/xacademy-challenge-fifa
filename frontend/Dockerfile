# Imagen base
FROM node:20-bullseye

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

RUN npm install -g @angular/cli

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Angular
EXPOSE 4200

# Comando para desarrollo con hot reload
CMD ["npm", "run", "start"]