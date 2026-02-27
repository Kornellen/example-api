# API Usage

- **Base URLs:**
  - HTTP: `http://container_address:8080/api`
  - HTTPS: `https://container_address:8081/api` (Only in development mode)

  HTTPS port is HTTP Port + 1. Ports can be changed in docker-compose files

### Authentication

- Uses **JWT** (JSON Web Tokens) with Bearer tokens.
- Include in headers:

  ```http
  Authorization: Bearer <token>
  ```

## Auth Endpoints

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

Get products from user's wishlist

**Request:**  
GET `/api/wishlist`

**Response:**

```json
[
  {
    "id": 1,
    "productId": "10",
    "wishlistId": 1
  }
]
```

---

### POST `/api/wishlist`

Add product to wishlist

**Request:**

```json
{
  "wishlistId": 1,
  "productId": "1"
}
```

**Response:**

```json
{
  "message": "Product Added to wishlist"
}
```

---

### DELETE `/api/wishlist`

Remove product to wishlist

**Request:**

```json
{
  "wishlistId": 1,
  "productId": "1"
}
```

**Response:**

```json
{
  "message": "Successfull removed from wishlist"
}
```
