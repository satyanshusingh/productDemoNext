import assert from 'node:assert/strict';
import test from 'node:test';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from '../src/products.service.js';

const product = {
  sku: 'SKU-001',
  name: 'Desk lamp',
  category: 'Lighting',
  price: '24.99',
  quantity: 4
};

test('update succeeds when the existing product has no changed fields', async () => {
  const db = {
    async execute(sql) {
      if (sql.startsWith('UPDATE')) return [{ affectedRows: 0 }, []];
      if (sql === 'SELECT id FROM products WHERE id = ?') return [[{ id: 7 }], []];
      if (sql.startsWith('SELECT id, sku')) return [[{ id: 7, ...product }], []];
      throw new Error(`Unexpected SQL: ${sql}`);
    }
  };

  const result = await new ProductsService(db).update(7, product);

  assert.equal(result.message, 'Product updated');
  assert.deepEqual(result.product, { id: 7, ...product });
});

test('update returns not found when no product matches the ID', async () => {
  const db = {
    async execute(sql) {
      if (sql.startsWith('UPDATE')) return [{ affectedRows: 0 }, []];
      if (sql === 'SELECT id FROM products WHERE id = ?') return [[], []];
      throw new Error(`Unexpected SQL: ${sql}`);
    }
  };

  await assert.rejects(
    () => new ProductsService(db).update(404, product),
    error => error instanceof NotFoundException && error.getStatus() === 404
  );
});
