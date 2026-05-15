#!/bin/sh

until mysqladmin ping -h"$DB_HOST" --silent; do
  echo "Esperando MySQL..."
  sleep 2
done

echo "MySQL listo"

npx sequelize-cli db:migrate

npm run start:dev