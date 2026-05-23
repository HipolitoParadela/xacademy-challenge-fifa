# Desarrollo del Challenge Individual de xAcademy

## Hipolito Paradela

### hparadela67@gmail.com

ME PRESENTO

## Plan de desarrollo

Habiendo leido la consiga completa junto con los puntos extras, definí un camino para ir cumpliendo todos los pasos. Los cuales son los siguientes:

## Servicios

    1 - Generar el archivo Docker Compose con el stack solicitado. Nextjs, Angular y Mysql
    2 - DockerFile para Nestjs, mas instalación de nestjs en carpeta backend/src
    3 - Dockerfile para Angular, más instalación de Angular en carpeta frontend/src
    4 - readme.md con el detalle de los pasos para levantar el proyecto

## BACKEND

    1 - Planificación de la base de datos y sus tablas
        Para esta aplicación preferí desglozar la tabla completa en tablas más pequeñas y relacionadas.
        La desición la tomo debido a que concidero mucho mejor tener una sola tabla entre varones y mujeres con sus respectivos datos más personales, y luego utilizar tablas auxiliares para el resto de la informaicón.

    2 - Crear archivos de migración de la db. La cual al levantar el docker-compose ya generará las tablas, estructuras y relaciones necesarias para el correcto funcionamiento de la plataforma.
        tablas:
            1 - clubs, que contrendrá id y nombre solamente
            2 - fifa_versions, que contrendrá id, version_number, year
            3 - players, que contendrá id, name, genero
            4 - skills, que contendrá id y name
            5 - player_skills, que contendrá id, player_id, fifa_version_number, skill_id, value 

    3 - Endpoint con CRUD de usuarios

    4 - Funcionalidades de autenticación con JWT

    5 - Endpoint de importar datos
        . Importar archivos csv, identificando si los jugadores son masculinos o femeninos.
            Esto me parecio importante hacerlo antes que despues, debido a que es un buen punto de partida contar ya con la base de datos inicializada con la información necesaria.

    6 - Endpoints para lectura del listados, lectura individual, creación, edición y borrado de jugadores, clubes, habiliades, etc
    7 - Tests en Postman
    8 - Desarrollo de la documentación en postman

## FRONT END

    1 - Diseño de la plantilla pensada tanto para desktop como para mobile.

    2 - Desarrollo de página y función de login

    3 - Desarrollo y funcionamiento de dashboard con la tabla de jugadores y filtros

    4 - Funcionalidad de exportar jugadores a excel

    5 - Desarrollo y funcionamiento de formulario para crear o editar un jugador. 

    6 - Desarrollo y funcionamiento de página de un jugador. Con gráficos y linea de tiempo.

    7 - En página de jugador, crear formulario para editar habilidades, según las vesiones de fifa. En caso de jugadores nuevos, si no tiene ya habilidades para esa versión las crea.

    8 - Incorporar a la línea de tiempo un análisis narrativo automático sobre la trayectoria del jugador.
        Ej: "A partir de 2019 se nota una baja en su aceleración, compensada por una mejora en la visión de juego"

## TEST GENERAL + MEJORAS

    Aquí ire anotando las mejoras tanto estéticas como funcionales que valla viendo al recorrer el sitio

    1 - Al estar en localhost, las imagenes no se muestran, intentaré solucionar la restricción. O utilizaré alguna imagen común para todos los jugadores.

    2 - Corregir que se muestre el club en la página de perfil del jugador.

    3 - Título y favicon de la aplicación

    4 - Botón de cerrar sesión

    5 - Permitir a la pagínación cargar diferentes cantidades de filas, 20, 50, 100, 200.



# VIDEO DE DEMOSTRACIÓN

