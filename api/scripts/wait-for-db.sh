#!/bin/sh
set -e


echo "Waiting for db..."
until pg_isready -h db -p 5432 -U app;  do
    echo "DB not ready yet..."
    sleep 2 
done


echo "DB is ready!"


if ! PGPASSWORD="$POSTREGS_PASSWORD" psql -h db -p 5432 -U app -d api -c "SELECT 1 FROM api.loginMethod"; then
    echo "No tables found... Starting default migration"

    PGPASSWORD="$POSTREGS_PASSWORD" npx prisma migrate dev -n "initial migration"
fi

npx prisma db seed

echo "Booting API..."
exec npm run start:dev

