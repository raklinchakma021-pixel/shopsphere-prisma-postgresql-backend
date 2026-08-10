

# ShopSphere Backend API Documentation

## 1. Project Overview

ShopSphere is a scalable e-commerce backend REST API built with:

* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication
* bcrypt
* Zod
* CORS
* dotenv

The API provides authentication, user management, category management, product management, reviews, and order management.

---

# 2. Base URL

### Development

```text
http://localhost:5000
```

### Production

```text
https://shopsphere-prisma-postgresql-backend.onrender.com
```

Replace the production URL after deployment.

---

# 3. Authentication

Protected endpoints require a JWT access token.

### Header

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

There are two roles:

```text
USER
ADMIN
```

Some endpoints require administrator privileges.

---

# 4. Standard API Response

Successful response:

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Product not found"
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "body.name",
      "message": "Product name is required"
    }
  ]
}
```

---

# 5. HTTP Status Codes

| Status | Meaning                        |
| ------ | ------------------------------ |
| 200    | Request successful             |
| 201    | Resource created               |
| 400    | Bad request / validation error |
| 401    | Authentication required        |
| 403    | Access denied                  |
| 404    | Resource not found             |
| 409    | Conflict                       |
| 500    | Internal server error          |

---

# 6. Authentication API

Base route:

```text
/api/auth
```

## Register

### Endpoint

```http
POST /api/auth/register
```

### Authentication

Not required.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Status Codes

```text
201 Created
400 Bad Request
409 Conflict
```

---

# Login

### Endpoint

```http
POST /api/auth/login
```

### Authentication

Not required.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "JWT_TOKEN"
  }
}
```

### Status Codes

```text
200 OK
400 Bad Request
401 Unauthorized
```

---

# 7. User API

Base route:

```text
/api/users
```

## Get All Users

```http
GET /api/users
```

### Authentication

Required.

### Authorization

ADMIN only.

### Headers

```http
Authorization: Bearer ADMIN_TOKEN
```

### Response

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": []
}
```

---

# Get User By ID

```http
GET /api/users/:id
```

### Authentication

Required.

### Example

```http
GET /api/users/USER_ID
```

### Response

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

# Update User

```http
PATCH /api/users/:id
```

### Authentication

Required.

### Request Body

```json
{
  "name": "Updated Name"
}
```

### Response

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {}
}
```

---

# Delete User

```http
DELETE /api/users/:id
```

### Authentication

Required.

### Authorization

ADMIN or authorized user.

### Response

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

> User deletion is implemented as **soft delete**.

---

# 8. Category API

Base route:

```text
/api/categories
```

## Create Category

```http
POST /api/categories
```

### Authentication

Required.

### Authorization

ADMIN.

### Request Body

```json
{
  "name": "Electronics",
  "description": "Electronic products"
}
```

### Response

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "CATEGORY_ID",
    "name": "Electronics",
    "description": "Electronic products"
  }
}
```

### Status Codes

```text
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
409 Conflict
```

---

# Get All Categories

```http
GET /api/categories
```

### Authentication

Not required.

### Response

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": []
}
```

---

# Get Category By ID

```http
GET /api/categories/:id
```

### Response

```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {}
}
```

---

# Update Category

```http
PATCH /api/categories/:id
```

### Authentication

Required.

### Authorization

ADMIN.

### Request Body

```json
{
  "name": "Updated Category",
  "description": "Updated description"
}
```

---

# Delete Category

```http
DELETE /api/categories/:id
```

### Authentication

Required.

### Authorization

ADMIN.

### Response

```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

Category deletion uses **soft delete**.

---

# 9. Product API

Base route:

```text
/api/products
```

## Create Product

```http
POST /api/products
```

### Authentication

Required.

### Authorization

ADMIN.

### Request Body

```json
{
  "name": "Wireless Headphones",
  "description": "Bluetooth wireless headphones",
  "price": 2500,
  "stock": 20,
  "status": "ACTIVE",
  "categoryId": "CATEGORY_ID"
}
```

### Response

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "PRODUCT_ID",
    "name": "Wireless Headphones",
    "description": "Bluetooth wireless headphones",
    "price": 2500,
    "stock": 20,
    "status": "ACTIVE"
  }
}
```

---

# Get All Products

```http
GET /api/products
```

### Authentication

Not required.

### Response

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": []
}
```

---

# Get Product By ID

```http
GET /api/products/:id
```

### Example

```http
GET /api/products/PRODUCT_ID
```

### Response

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "PRODUCT_ID",
    "name": "Wireless Headphones",
    "price": 2500,
    "stock": 20,
    "status": "ACTIVE"
  }
}
```

---

# Update Product

```http
PATCH /api/products/:id
```

### Authentication

Required.

### Authorization

ADMIN.

### Request Body

```json
{
  "name": "Updated Headphones",
  "price": 2800,
  "stock": 15
}
```

---

# Delete Product

```http
DELETE /api/products/:id
```

### Authentication

Required.

### Authorization

ADMIN.

### Response

```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

Product deletion uses **soft delete**.

---

# 10. Review API

Base route:

```text
/api/reviews
```

## Create Review

```http
POST /api/reviews
```

### Authentication

Required.

### Request Body

```json
{
  "productId": "PRODUCT_ID",
  "rating": 5,
  "comment": "Excellent product!"
}
```

### Response

```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "REVIEW_ID",
    "rating": 5,
    "comment": "Excellent product!"
  }
}
```

---

# Get All Reviews

```http
GET /api/reviews
```

### Authentication

Not required.

### Response

```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": []
}
```

---

# Get Review By ID

```http
GET /api/reviews/:id
```

### Response

```json
{
  "success": true,
  "message": "Review retrieved successfully",
  "data": {}
}
```

---

# Update Review

```http
PATCH /api/reviews/:id
```

### Authentication

Required.

### Request Body

```json
{
  "rating": 4,
  "comment": "Good product."
}
```

---

# Delete Review

```http
DELETE /api/reviews/:id
```

### Authentication

Required.

### Response

```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

Review deletion uses **soft delete**.

---

# 11. Order API

Base route:

```text
/api/orders
```

## Create Order

```http
POST /api/orders
```

### Authentication

Required.

### Request Body

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

### Response

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "ORDER_ID",
    "quantity": 2,
    "total": 5000,
    "status": "PENDING",
    "product": {
      "id": "PRODUCT_ID",
      "name": "Wireless Headphones",
      "price": 2500
    }
  }
}
```

### Important Behavior

Order creation uses a **Prisma transaction**.

The transaction:

```text
Create Order
     ↓
Check Product
     ↓
Check Stock
     ↓
Calculate Total
     ↓
Reduce Stock
     ↓
Commit Transaction
```

If an operation fails, the transaction is rolled back.

---

# Get Orders

```http
GET /api/orders
```

### Authentication

Required.

### USER

A normal user receives their own orders.

### ADMIN

An admin receives all orders.

### Response

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": []
}
```

---

# Get Order By ID

```http
GET /api/orders/:id
```

### Authentication

Required.

### Authorization

Order owner or ADMIN.

### Response

```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": "ORDER_ID",
    "quantity": 2,
    "total": 5000,
    "status": "PENDING"
  }
}
```

---

# Update Order Status

```http
PATCH /api/orders/:id/status
```

### Authentication

Required.

### Authorization

ADMIN only.

### Request Body

```json
{
  "status": "CONFIRMED"
}
```

Allowed statuses:

```text
PENDING
CONFIRMED
SHIPPED
DELIVERED
CANCELLED
```

### Response

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {}
}
```

---

# Delete Order

```http
DELETE /api/orders/:id
```

### Authentication

Required.

### Authorization

Order owner or ADMIN.

### Response

```json
{
  "success": true,
  "message": "Order deleted successfully",
  "data": null
}
```

Order deletion uses **soft delete**.

---

# 12. Prisma Database

The project uses Prisma ORM with PostgreSQL.

### Prisma Commands

Generate Prisma Client:

```bash
npx prisma generate
```

Validate schema:

```bash
npx prisma validate
```

Create migration:

```bash
npx prisma migrate dev --name init
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# 13. Database Features

The database implements:

* PostgreSQL
* Prisma ORM
* Primary keys
* Foreign keys
* Relations
* Enums
* Indexes
* Soft delete
* Created timestamps
* Updated timestamps
* Table mapping with `@@map()`

---

# 14. Authentication Flow

```text
Register
   ↓
Validate Input
   ↓
Hash Password with bcrypt
   ↓
Save User
   ↓
Login
   ↓
Compare Password
   ↓
Generate JWT
   ↓
Client Stores Token
   ↓
Send Bearer Token
   ↓
JWT Middleware
   ↓
Check User / Role
   ↓
Access Protected Resource
```

---

# 15. Authorization

### USER

Can:

* Login
* View products
* View categories
* Create reviews
* Manage own reviews
* Create orders
* View own orders
* Manage own resources where permitted

### ADMIN

Can:

* Manage users
* Manage categories
* Manage products
* Manage orders
* Update order status
* Access administrative resources

---

# 16. Environment Variables

Create `.env`:

```env
DATABASE_URL="your-postgresql-database-url"

JWT_SECRET="your-jwt-secret"

JWT_EXPIRES_IN="7d"

PORT=5000

CLIENT_URL="http://localhost:3000"
```

Never commit `.env` to GitHub.

---

# 17. Running the Server

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Start development server:

```bash
npm run dev
```

The server runs on:

```text
http://localhost:5000
```

---

# 18. Project Structure

```text
shopsphere-server/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── generated/
│   └── prisma/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── lib/
│   │   └── prisma.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validateRequest.ts
│   │   └── globalErrorHandler.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── category.routes.ts
│   │   ├── product.routes.ts
│   │   ├── review.routes.ts
│   │   └── order.routes.ts
│   │
│   └── services/
│       ├── auth/
│       ├── user/
│       ├── category/
│       ├── product/
│       ├── review/
│       └── order/
│
├── .env
├── .env.example
├── .gitignore
├── API_DOCUMENTATION.md
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

# 19. API Endpoint Summary

| Module     | Method | Endpoint                 | Auth  |
| ---------- | ------ | ------------------------ | ----- |
| Auth       | POST   | `/api/auth/register`     | No    |
| Auth       | POST   | `/api/auth/login`        | No    |
| Users      | GET    | `/api/users`             | Admin |
| Users      | GET    | `/api/users/:id`         | Yes   |
| Users      | PATCH  | `/api/users/:id`         | Yes   |
| Users      | DELETE | `/api/users/:id`         | Yes   |
| Categories | POST   | `/api/categories`        | Admin |
| Categories | GET    | `/api/categories`        | No    |
| Categories | GET    | `/api/categories/:id`    | No    |
| Categories | PATCH  | `/api/categories/:id`    | Admin |
| Categories | DELETE | `/api/categories/:id`    | Admin |
| Products   | POST   | `/api/products`          | Admin |
| Products   | GET    | `/api/products`          | No    |
| Products   | GET    | `/api/products/:id`      | No    |
| Products   | PATCH  | `/api/products/:id`      | Admin |
| Products   | DELETE | `/api/products/:id`      | Admin |
| Reviews    | POST   | `/api/reviews`           | Yes   |
| Reviews    | GET    | `/api/reviews`           | No    |
| Reviews    | GET    | `/api/reviews/:id`       | No    |
| Reviews    | PATCH  | `/api/reviews/:id`       | Yes   |
| Reviews    | DELETE | `/api/reviews/:id`       | Yes   |
| Orders     | POST   | `/api/orders`            | Yes   |
| Orders     | GET    | `/api/orders`            | Yes   |
| Orders     | GET    | `/api/orders/:id`        | Yes   |
| Orders     | PATCH  | `/api/orders/:id/status` | Admin |
| Orders     | DELETE | `/api/orders/:id`        | Yes   |

---
