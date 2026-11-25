import mysql from 'mysql2/promise';
import nestCommon from '@nestjs/common';

const { Injectable, ServiceUnavailableException } = nestCommon;

class DatabaseService {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'inventory_classroom',
      waitForConnections: true,
      connectionLimit: 10,
      decimalNumbers: false
    });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT 1 AS connected');
      console.log('MySQL connection established');
    } catch (error) {
      console.error('MySQL connection failed:', error.message);
      throw new ServiceUnavailableException('Database is unavailable');
    }
  }

  async execute(sql, values = []) {
    return this.pool.execute(sql, values);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}

Injectable()(DatabaseService);

export { DatabaseService };
