![GitHub License](https://img.shields.io/github/license/Kornellen/example-api?color=blue)
![Static Badge](https://img.shields.io/badge/TypeScript-TypeScript?logo=typescript&color=gray)
![Static Badge](https://img.shields.io/badge/Prisma-Prisma?logo=prisma&logoSize=amg&color=gray)
![Static Badge](https://img.shields.io/badge/Docker-Docker?logo=docker&logoSize=amg&color=gray)
![Static Badge](https://img.shields.io/badge/Nginx-Nginx?logo=nginx&logoSize=amg&color=gray)

# Example REST API

## Overview

This is my the biggest REST API project. It was made to learn new things and check myself. It uses:

- Node.js (TypeScript)
- Express.js
- Prisma ORM
- Redis
- Nginx
- Docker & Docker-compose

In this project I tried Containerization with Docker, Advanced Architeture Patterns such as Dependecy Injection with DI Container, Singletons, DTOs... The API Architecutre is splited into layers like:

- Controller layer
- Service Layer
- Repository layer

Maybe this project isn't perfect and secure API, however i'm very proud of myself for doing this

Supports HTTPS communication in devolpment mode

Support login via `Google OAuth`

Supports Redis for caching

I'm open for any advices

## Requirements

- **Node.Js** >= 20.0.0
- **npm** >= 9.0.0
- **git**
- **Docker & Docker-compose**

  For testing:

- **Postman**
- **cURL**

## Project Structure

```txt
└──📂 api
    └──📂 docker
    └──📂 docs
    └──📂 nginx
    └──📂 prisma
    └──📂 public
    └──📂 scripts
    └──📂 src
        └──📂 REST
            └──📂 controllers
            └──📂 helpers
            └──📂 middlewares
            └──📂 repositories
                └──📂 interfaces
                └──📂 types
            └──📂 routes
            └──📂 services
                └──📂 __test__
                └──📂 auth
                    └──📂 passport
                    └──📂 strategies
                └──📂 interfaces
                └──📂 types
                    └──📂 dtos
        └──📂 utils
            └──📂 config
            └──📂 decorators
            └──📂 env
            └──📂 infrastructure
            └──📂 others
            └──📂 security
        └──📂 WebSocket
    └──📂 types
        └──📂 express
        └──📂 global
        └──📂 ssl
    ├── .dockerignore
    ├── .env.template
    ├── .gitignore
    ├── jest.config.js
    ├── nodemon.json
    ├── package-lock.json
    ├── package.json
    ├── prisma.config.ts
    └── tsconfig.json
```

## Getting Started

1. **Clone the repository**

```bash
git clone <repo-link.git>
cd <repo-directory>/api
```

## Development

2. **Run Docker Compose**

```bash
docker compose -f docker/docker-compose.yaml up --build
```

In development mode API supports fast reloads

## Production

2. **Build Docker Image**

```bash
docker build -f docker/Dockerfile.prod . -t my-backend:1.0.2
```

3. **Run Docker Compose**

```bash
docker compose -f docker/docker-compose-prod.yaml up
```

4. **If first time running:**

Detach from previous step and run:

```bash
docker compose -f docker/docker-compose-prod.yaml exec api npx prisma migrate dev -n 'migration_name'
```

## Miscs

- **Generate JWT Secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Notes

- See [`public/index.html`](api/public/index.html) for a simple API test page
- See [`docs/API.md`](api/docs/Endpoints.md) for endpoints documentation
- Example unit tests can be seen [here](api/src/REST/services/__test__/comment.services.spec.ts)

## License

This project is under [MIT License](LICENSE)
