# Levantar servicios

1 - En la raiz del archivo correr el comando docker-compose up
2 - Ingresar a la shell del backend y correr migraciones, para generar las tablas necesarias
        cd backend
        docker exec -it nestjs_backend sh
                npx sequelize-cli db:migrate
                npx sequelize-cli db:seed:all
3 - Importar el json de postman, generar una key de JWT para poder utilizar los endpoints generales
4 - En postman, usar el endpoint Jugadores->Importar jugadores, para importar desde los csv que comienzan con "recortado-...", uno para varones y otro mujeres.
5 - En el archivo .env de la carpeta backend, ingresar una api_key de openAi
6 - Desde un navegador ingresar a localhost:4200, realizar login con usuario Admin, contraseña "admin".
