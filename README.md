# Backend for E-Commerce Platform

This is the backend for an e-commerce platform focusing on product and inventory management, order management, and user authentication. The API supports the following features:

## Features

### 1. Product Management
- **Create**: Add new products with details like name, description, price, SKU, and stock quantity.
- **Read**: Retrieve individual product information and a paginated list of products.
- **Update**: Update product details, including price and stock quantity.
- **Delete**: Soft-delete or permanently delete a product.

### 2. Inventory Management
- **Adjust Stock**: Increase or decrease stock levels for a product.
- **Out of Stock Alert**: Automatically flag products with stock levels below a defined threshold.
- **Inventory Overview**: Provide a summary of all products and their stock levels.

### 3. Order Management
- **Place Order**: Create a new order that decreases stock levels for the ordered items.
- **Order Summary**: Retrieve a summary of individual orders, including product details, quantities, total cost, and status.
- **Order Status Management**: Allow updates to order statuses (e.g., "Pending," "Shipped," "Completed," "Cancelled").
- **Validation**: Ensure orders cannot be placed if the requested quantity exceeds available stock.

### 4. User Authentication & Authorization
- **JWT Authentication**:
  - **Admin Role**: Full access to manage products, inventory, and orders.
  - **User Role**: Limited to placing and viewing orders only.

### 5. Reporting and Insights (Bonus)
- **Top Selling Products**: List products with the highest sales.
- **Low Stock Products**: List products with low stock levels.

## API Endpoints

### Authentication
- **POST /api/auth/login**: Login to get a JWT token.
  - Request body: `{ "email": "user@example.com", "password": "yourpassword" }`
  - Response: `{ "token": "JWT_TOKEN_HERE" }`
  
- **POST /api/auth/register**: Register a new user.
  - Request body: `{ "email": "user@example.com", "password": "yourpassword" }`
  - Response: `{ "message": "User registered successfully" }`

### Product Management
- **GET /api/products**: Retrieve a list of products (paginated).
- **GET /api/products/:id**: Retrieve a single product by ID.
- **POST /api/products**: Create a new product.
- **PUT /api/products/:id**: Update a product.
- **DELETE /api/products/:id**: Soft-delete or permanently delete a product.

### Inventory Management
- **POST /api/inventory/adjust**: Adjust stock for a product.
  - Request body: `{ "productId": "123", "adjustment": 5 }` (Positive for increasing stock, negative for decreasing stock)
  
- **GET /api/inventory/overview**: Get a summary of all products and their stock levels.

### Order Management
- **POST /api/orders**: Place a new order.
  - Request body: `{ "productId": "123", "quantity": 2 }`
  
- **GET /api/orders/:id**: Get order details by ID.
- **GET /api/orders**: Get a list of all orders.
- **PUT /api/orders/:id/status**: Update the order status.

### Reporting and Insights
- **GET /api/reports/top-selling-products**: Get a list of top-selling products.
- **GET /api/reports/low-stock-products**: Get a list of products with low stock levels.

## Environment Setup

1. Clone the repository.
2. Install dependencies:

## Edit the env file both on server side and client side

## example .env file
PORT=5000
DB_URI=your-database-uri
JWT_SECRET=your-jwt-secret

