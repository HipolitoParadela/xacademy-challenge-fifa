#Desarrollo del Challenge Individual de xAcademy

### Hipolito Paradela
### hparadela67@gmail.com

## Plan de desarrollo
Habiendo leido la consiga completa junto con los puntos extras, definí un camino para ir cumpliendo todos los pasos. Los cuales son los siguientes:

MEJORAR
    1 - Controlar rutas autenticadas
    2 - Que las migraciones corran con el dockerfile
    3 - Ver porque no levanta solo el backend
    4 - Estudiar el tema de como esto se levanta en producción

#Servicios
1 - Generar el archivo Docker Compose con el stack solicitado. Nextjs, Angular y Mysql
2 - DockerFile para Nestjs, mas instalación de nestjs en carpeta backend/src
3 - Dockerfile para Angular, más instalación de Angular en carpeta frontend/src
4 - readme.md con el detalle de los pasos para levantar el proyecto


#Backend Fase 1

1 - Planificación de la base de datos y sus tablas
    Para esta aplicación preferí desglozar la tabla completa en tablas más pequeñas y relacionadas.
    La desición la tomo debido a que concidero mucho mejor tener una sola tabla entre varones y mujeres con sus respectivos datos más personales, y luego utilizar tablas auxiliares para el resto de la informaicón.

2 - Crear archivos de migración de la db. La cual al levantar el docker-compose ya generará las tablas, estructuras y relaciones necesarias para el correcto funcionamiento de la plataforma.

3 - Endpoint con CRUD de usuarios

4 - Funcionalidades de autenticación con JWT

5 - Endpoint de importar datos
    . Importar archivos csv, identificando si los jugadores son masculinos o femeninos.
        Esto me parecio importante hacerlo antes que despues, debido a que es un buen punto de partida contar ya con la base de datos inicializada con la información necesaria.

6 - Endpoints para lectura del listados, lectura individual, creación, edición y borrado de jugadores, clubes, habiliades, etc
7 - Tests en Postman
8 - Desarrollo de la documentación en postman


#Frontend fase 1
1 - Diseño de la plantilla pensada tanto para desktop como para mobile.
2 - Desarrollo de las páginas previamente diseñadas. Login, Dashboard, Listado de jugadores, Listado de clubes, Listado de Versiones del Fifa, etc.
3 - Conecciones de cada pantalla con el back para dinamizar el contenido.
4 - Tests
5 - Video de demostración
