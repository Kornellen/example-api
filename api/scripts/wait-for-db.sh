#!/bin/sh
set -e


echo "Waiting for db..."
until pg_isready -h db -p 5432 -U app;  do
    echo "DB not ready yet..."
    sleep 2
done


echo "DB is ready"

echo "Running prisma migration..."
npx prisma migrate dev --name init


echo "Staring API"
npm run start:dev

