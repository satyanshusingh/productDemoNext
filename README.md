# Product Stockroom

A product inventory CRUD application with a Next.js web client, a NestJS API, and a MySQL database.

## Architecture and request flow

```text
Browser
  -> Next.js app (node-mysql-crud-client, usually http://localhost:3000)
       -> /api/* rewrite (API_PROXY_TARGET)
            -> NestJS REST API (node-mysql-crud, usually http://localhost:3456)
                 -> ProductsController
                      -> ProductsService (validation and product rules)
                           -> DatabaseService (mysql2 connection pool)
                                -> MySQL database: inventory_classroom
```

The browser calls the same-origin `/api/products` endpoints. Next.js rewrites those requests to the API host, so the browser does not need a direct MySQL connection. The API validates product data, runs parameterized SQL statements, and returns JSON; MySQL persists the product records.

## Application structure

```text
node-mysql-crud/                 # API and database access
  server.js                      # Starts NestJS, configures port and CORS
  schema.sql                     # Creates the products table
  src/
    app.module.js                # Registers controller and services
    controllers/
      products.controller.js     # REST routes under /api/products
    products.service.js          # Validation and product queries
    database.service.js          # MySQL connection pool and lifecycle
  test/
    products.service.test.js     # API service tests

node-mysql-crud-client/          # Next.js web application
  app/                           # App Router entry point, layout and providers
  src/
    ProductsPage.jsx             # Product page state and CRUD actions
    api/products.js              # HTTP client for the product API
    components/                  # Product UI components
    schemas/                     # Form validation
    utils/                       # Formatting helpers
```

## Technologies

- **Frontend:** Next.js App Router, React, Material UI, React Hook Form, and Zod
- **Backend:** Node.js, NestJS, and RxJS
- **Database:** MySQL, accessed through the `mysql2` promise API and a connection pool
- **Tests and lint:** Vitest and Testing Library for the client; Node's test runner for the API; Oxlint for client linting

Use Node.js 20.9 or newer and npm.

## Database setup

1. Install MySQL Server and start its service. You can manage the service with Windows Services or use your MySQL installation's normal startup method.
2. Connect to MySQL using MySQL Workbench or the MySQL command-line client and create a database and an application user. For example, replace the example password with your own:

   ```sql
   CREATE DATABASE inventory_classroom;
   CREATE USER 'inventory_app'@'127.0.0.1' IDENTIFIED BY 'change_this_password';
   GRANT ALL PRIVILEGES ON inventory_classroom.* TO 'inventory_app'@'127.0.0.1';
   ```

3. Open `node-mysql-crud/schema.sql` in Workbench, select `inventory_classroom` as the active schema (or run `USE inventory_classroom;` first), then execute the script. It creates the `products` table. The API does not automatically create the database or tables.
4. Create or edit `node-mysql-crud/.env` with the connection settings:

   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=inventory_app
   DB_PASSWORD=change_this_password
   DB_NAME=inventory_classroom
   API_PORT=3456
   ```

   Keep the values in `.env` consistent with the MySQL user and database you created. `DB_NAME` defaults to `inventory_classroom`; the other database connection values must be supplied. The backend checks the connection when it starts.

### How database access works

`DatabaseService` creates a MySQL connection pool (up to 10 connections) and verifies it with a `SELECT 1` at startup. `ProductsService` uses parameterized SQL through that pool for product listing, filtering, summaries, inserts, updates, and deletes. The table uses an auto-incrementing ID, a unique SKU, and timestamps; price and quantity are stored as decimal and integer values. When the API shuts down, it closes the pool.

## Run locally

Start MySQL and ensure the database and `products` table are set up first. Then use **two PowerShell terminals** from the project root.

**Terminal 1 — API**

```powershell
cd .\node-mysql-crud
npm install
npm run dev
```

The API listens at `http://localhost:3456` when configured as above. Its default port is `3000` if `API_PORT` is not set.

**Terminal 2 — web app**

```powershell
cd .\node-mysql-crud-client
npm install
npm run dev
```

Open the local URL printed by Next.js (normally `http://localhost:3000`). The client proxies `/api/*` to `http://localhost:3456` by default. To use a different API address, create `node-mysql-crud-client/.env.local` and set, for example:

```env
API_PROXY_TARGET=http://localhost:3001
```

## API routes

All routes are prefixed with `/api/products`:

- `GET /api/products` — list products; supports `page`, `limit`, `search`, and `category` query parameters
- `GET /api/products/categories` — list categories
- `GET /api/products/summary` — inventory totals and category summary
- `GET /api/products/:id` — get one product
- `POST /api/products` — create a product
- `PUT /api/products/:id` — update a product
- `DELETE /api/products/:id` — delete a product

## Tests and other commands

Run these commands from the relevant project directory:

```powershell
# API tests
cd .\node-mysql-crud
npm test

# Client tests, lint, or production build
cd ..\node-mysql-crud-client
npm test
npm run lint
npm run build
```
