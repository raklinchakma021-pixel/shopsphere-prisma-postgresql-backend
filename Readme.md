# 🛒 ShopSphere Backend

ShopSphere is a production-ready e-commerce REST API built with **Express.js, TypeScript, Prisma ORM, and PostgreSQL**.

The backend provides secure JWT authentication, role-based authorization, product and category management, reviews, order management, validation, soft deletion, and relational database management.

---

## 🚀 Live API

**Live Backend URL:**  
`https://shopsphere-prisma-postgresql-backend.onrender.com`

> Replace this URL with your deployed backend URL after deployment.

---

## 📚 API Documentation

Complete API documentation is available here:

[API Documentation](./API_DOCUMENTATION.md)

---

## 🛠️ Technology Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL
- Prisma ORM
- Prisma Migrate
- Prisma Studio

### Authentication & Security

- JWT
- bcrypt
- Role-Based Authorization
- CORS
- dotenv

### Validation

- Zod

---

## ✨ Key Features

### 🔐 Authentication

- User registration
- User login
- Password hashing with bcrypt
- JWT authentication
- Protected routes
- Role-based authorization
- USER and ADMIN roles

### 👤 User Management

- Get users
- Get user by ID
- Update user
- Soft delete user
- Admin authorization

### 📂 Category Management

- Create category
- Get all categories
- Get category by ID
- Update category
- Soft delete category
- Admin-only management

### 📦 Product Management

- Create product
- Get all products
- Get product by ID
- Update product
- Soft delete product
- Product status management
- Category relationship

### ⭐ Review Management

- Create review
- Get reviews
- Get review by ID
- Update review
- Soft delete review
- Product and user relationships

### 🛍️ Order Management

- Create order
- Get orders
- Get order by ID
- Update order status
- Soft delete order
- Stock validation
- Automatic total calculation
- Prisma transaction support

---

## 🗄️ Database Features

The project uses a normalized PostgreSQL database with Prisma ORM.

Implemented database features:

- Primary keys
- Foreign keys
- One-to-many relationships
- Enums
- Indexes
- Soft delete
- Created timestamps
- Updated timestamps
- Table mapping using `@@map()`

### Main Models

```text
User
Category
Product
Review
Order
