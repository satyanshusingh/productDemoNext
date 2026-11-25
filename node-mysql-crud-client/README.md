# Stockroom product frontend

A Next.js App Router frontend for the NestJS/MySQL product API. It uses Material UI for the interface, React Hook Form for form state, and Zod for validation.

## Run locally

1. In `node-mysql-crud`, install dependencies and start the backend on port `3456` (for example, set `API_PORT=3456` before `npm run dev`). Create the `inventory_classroom` database and run `schema.sql`.
2. In this directory, install dependencies with `npm install`.
3. Start the frontend with `npm run dev` and open the local URL printed by Next.js.

Next.js rewrites `/api` requests to `http://localhost:3456` by default. If the backend uses another host or port, set `API_PROXY_TARGET` in this project's `.env.local` file, for example:

```env
API_PROXY_TARGET=http://localhost:3001
```

## Source structure

- `app/` — Next.js App Router entry point, layout, and Material UI theme provider
- `src/ProductsPage.jsx` — page state and product CRUD actions
- `src/components/` — reusable header, summary, catalog, table, dialogs, and notifications
- `src/api/products.js` — product API requests
- `src/schemas/productSchema.js` — form validation and request payload conversion
- `src/utils/formatters.js` — inventory, currency, and number formatting

## Available scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — create a production build
- `npm start` — start the production server
- `npm run lint` — run Oxlint
- `npm test` — run component tests
