FROM node:20-alpine

WORKDIR /api


COPY . .
RUN npm ci

RUN apk add --no-cache postgresql-client

RUN apk add --no-cache openssl

RUN mkdir -p /api/certificates && \
    openssl req -x509 -nodes -days 40 \
    -newkey rsa:4096 \
    -keyout /api/certificates/key.key \
    -out   /api/certificates/cert.crt \
    -subj "/CN=localhost"

EXPOSE 80 443 5050

RUN chmod +x /api/scripts/wait-for-db.sh

ENTRYPOINT ["/api/scripts/wait-for-db.sh"]
