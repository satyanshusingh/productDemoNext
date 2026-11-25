import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module.js';

const port = process.env.API_PORT === undefined ? 3000 : Number(process.env.API_PORT);
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5500')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Invalid API_PORT');
}

const app = await NestFactory.create(AppModule);
app.enableShutdownHooks();
app.enableCors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});
await app.listen(port, 'localhost');
console.log(`NestJS MySQL CRUD API is running at http://localhost:${port}`);
