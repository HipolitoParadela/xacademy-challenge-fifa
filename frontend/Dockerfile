FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Compila la app Angular
RUN npm run build

# Sirve con Angular CLI (modo dev)
EXPOSE 4200
CMD ["npm", "start"]