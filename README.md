# Example REST API

## Overview

Example API showing my Backend Skills. Uses Express & Prisma ORM & TypeScript

## Requirements

- Node.Js >= 20.0.0
- npm >= 9.0.0
- openSSL - for self-signed certificates for HTTPS
- git

## Project Structure

```
    └── 📁api
    │   ├── 📁certificates         # SSL certificates (cert.crt, key.key, etc.)
    │   ├── 📁logs                 # Application logs
    │   ├── 📁prisma               # Prisma ORM files (schema, migrations, seed)
    │   ├── 📁public               # Static files (HTML, CSS, JS)
    │   ├── 📁src                  # Source code
    │   │   ├── 📁REST                 # REST API logic
    │   │   │   ├── 📁controllers          # API controllers (business logic)
    │   │   │   ├── 📁helpers              # Helper classes (e.g., HttpError)
    │   │   │   ├── 📁middlewares          # Express middlewares (auth, validation, etc.)
    │   │   │   ├── 📁repositories         # Data access layer (DB queries)
    │   │   │   ├── 📁routes               # Route definitions
    │   │   │   └── 📁services             # Business logic/services
    │   │   │       └── 📁auth                 # Auth-related services
    │   │   │           ├── 📁passport             # Passport.js logic
    │   │   │           └── 📁strategies           # Auth strategies (Google, classic)
    │   │   ├── 📁utils                # Utilities and shared modules
    │   │   │   ├── 📁config              # App configs and logger
    │   │   │   ├── 📁decorators          # Custom TypeScript decorators
    │   │   │   ├── 📁env                 # Environment and certificate management
    │   │   │   ├── 📁infrastructure      # Server, middleware, and Prisma setup
    │   │   │   ├── 📁others               # Miscellaneous helpers/type guards
    │   │   │   └── 📁security             # Security utilities
    │   │   └── 📁WebSocket            # WebSocket logic
    │   ├── 📁types                # TypeScript type definitions
    │   │   ├── 📁express              # Express type extensions
    │   │   ├── 📁global               # Global types
    │   │   └── 📁ssl                  # SSL-related types
    │   ├── .env.template         # Environment variable template
    │   ├── .gitignore            # Git ignore rules
    │   ├── jest.config.js        # Jest test configuration
    │   ├── package-lock.json     # npm lockfile
    │   ├── package.json          # Project dependencies and scripts
    │   ├── tsconfig.json         # TypeScript configuration
    └── README.md             # Project documentation
```

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repo-link.git>
   cd <repo-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Start the API (development mode)**

   ```bash
   npm run start:dev
   ```

5. **Start the API (production/compiled)**
   ```bash
   npm start
   ```

---

## API Usage

- **Base URLs:**
  - HTTP: `http://localhost:8080/api`
  - HTTPS: `https://localhost:8081/api`
    (Ports are set in `.env`; HTTPS port = HTTP port + 1)

### Authentication

- Uses **JWT** (JSON Web Tokens) with Bearer tokens.
- Include in headers:

  ```http
  Authorization: Bearer <token>
  ```

### Auth Endpoints

### POST `/api/login`

Authenticate user and receive a JWT.

**Request:**

```json
{
  "login": "johndoe",
  "password": "superSecretP@@$word"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST `/api/register`

Register a new user.

**Request:**

```json
{
  "username": "johndoe",
  "email": "johndoe@gmail.com",
  "password": "superSecretP@@$word"
}
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

---

### GET `/api/auth/google`

Redirect to Google OAuth.

**Request:**  
_No body. Open in browser or use HTTP client._

**Response:**  
302 Redirect to Google OAuth.

---

### GET `/api/auth/google/callback`

Google OAuth callback, returns JWT.

**Request:**  
_No body. Called by Google after authentication._

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## User Endpoints

### GET `/api/dashboard`

Get current user data (requires JWT).

**Request:**  
Header: `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "johndoe@gmail.com",
  "createdAt": "2025-06-18T12:00:00.000Z"
}
```

---

### GET `/api/user/:id`

Get user by ID.

**Request:**  
GET `/api/user/2`

**Response:**

```json
{
  "id": 2,
  "username": "janedoe",
  "email": "janedoe@gmail.com",
  "createdAt": "2025-06-18T12:00:00.000Z"
}
```

---

### PATCH `/api/user/:id/change`

Update user data (username, email, password).

**Request:**  
PATCH `/api/user/2/change`

```json
{
  "changes": {
    "username": "newUsername",
    "email": "newemail@example.com"
  }
}
```

**Response:**

```json
{
  "message": "User updated successfully"
}
```

---

### DELETE `/api/user/:id/delete`

Delete user by ID.

**Request:**  
DELETE `/api/user/2/delete`

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

---

## Post Endpoints

### POST `/api/post`

Create a new post.

**Request:**

```json
{
  "title": "Hello World!",
  "content": "This is an example post",
  "published": false
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Hello World!",
  "content": "This is an example post",
  "published": false,
  "authorId": 1,
  "createdAt": "2025-06-18T12:00:00.000Z"
}
```

---

### GET `/api/post`

Get all posts.

**Request:**  
GET `/api/post`

**Response:**

```json
[
  {
    "id": 1,
    "title": "Hello World!",
    "content": "This is an example post",
    "published": true,
    "authorId": 1,
    "createdAt": "2025-06-18T12:00:00.000Z"
  }
]
```

---

### GET `/api/post/:id`

Get post by ID.

**Request:**  
GET `/api/post/1`

**Response:**

```json
{
  "id": 1,
  "title": "Hello World!",
  "content": "This is an example post",
  "published": true,
  "authorId": 1,
  "createdAt": "2025-06-18T12:00:00.000Z"
}
```

---

### PUT `/api/post/:id`

Update post visibility or content.

**Request:**  
PUT `/api/post/1`

```json
{
  "published": true,
  "title": "Updated Title"
}
```

**Response:**

```json
{
  "message": "Post updated successfully"
}
```

---

### DELETE `/api/post/:id`

Delete post by ID.

**Request:**  
DELETE `/api/post/1`

**Response:**

```json
{
  "message": "Post deleted successfully"
}
```

---

## Comment Endpoints

### POST `/api/comment`

Create a new comment.

**Request:**

```json
{
  "postId": 1,
  "content": "This is a comment"
}
```

**Response:**

```json
{
  "id": 1,
  "postId": 1,
  "userId": 1,
  "content": "This is a comment",
  "createdAt": "2025-06-18T12:00:00.000Z"
}
```

---

### GET `/api/comment/:id`

Get comment by ID.

**Request:**  
GET `/api/comment/1`

**Response:**

```json
{
  "id": 1,
  "postId": 1,
  "userId": 1,
  "content": "This is a comment",
  "createdAt": "2025-06-18T12:00:00.000Z"
}
```

---

### GET `/api/comment/post/:postId`

Get all comments for a post.

**Request:**  
GET `/api/comment/post/1`

**Response:**

```json
[
  {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "content": "This is a comment",
    "createdAt": "2025-06-18T12:00:00.000Z"
  }
]
```

---

### PUT `/api/comment/:id`

Update comment content.

**Request:**  
PUT `/api/comment/1`

```json
{
  "content": "Updated comment"
}
```

**Response:**

```json
{
  "message": "Comment updated successfully"
}
```

---

### DELETE `/api/comment/:id`

Delete comment by ID.

**Request:**  
DELETE `/api/comment/1`

**Response:**

```json
{
  "message": "Comment deleted successfully"
}
```

---

## Wishlist Endpoints

### GET `/api/wishlist`

Get all wishlists for the current user.

**Request:**  
GET `/api/wishlist`

**Response:**

```json
[
  {
    "id": 1,
    "name": "My Wishlist",
    "userId": 1,
    "posts": [1, 2]
  }
]
```

---

### POST `/api/wishlist`

Create a new wishlist.

**Request:**

```json
{
  "name": "My Wishlist"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "My Wishlist",
  "userId": 1,
  "posts": []
}
```

---

### GET `/api/wishlist/:id`

Get wishlist by ID.

**Request:**  
GET `/api/wishlist/1`

**Response:**

```json
{
  "id": 1,
  "name": "My Wishlist",
  "userId": 1,
  "posts": [1, 2]
}
```

---

### PUT `/api/wishlist/:id`

Update wishlist by ID.

**Request:**  
PUT `/api/wishlist/1`

```json
{
  "name": "Updated Wishlist Name"
}
```

**Response:**

```json
{
  "message": "Wishlist updated successfully"
}
```

---

### DELETE `/api/wishlist/:id`

Delete wishlist by ID.

**Request:**  
DELETE `/api/wishlist/1`

**Response:**

```json
{
  "message": "Wishlist deleted successfully"
}
```

---

### POST `/api/wishlist/:id/add`

Add a post to a wishlist.

**Request:**

```json
{
  "postId": 123
}
```

**Response:**

```json
{
  "message": "Post added to wishlist"
}
```

---

### POST `/api/wishlist/:id/remove`

Remove a post from a wishlist.

**Request:**

```json
{
  "postId": 123
}
```

**Response:**

```json
{
  "message": "Post removed from wishlist"
}
```

## Miscs

- **Generate JWT Secret:**

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- **Generate SSL Certificate (OpenSSL):**
  ```bash
  openssl req -nodes -x509 -keyout key.key -out cert.crt
  ```

## Notes

- See `public/index.html` for a simple API test page
