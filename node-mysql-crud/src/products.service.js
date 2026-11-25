import nestCommon from '@nestjs/common';
import { z, ZodError } from 'zod';
import { DatabaseService } from './database.service.js';

const {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  ConflictException
} = nestCommon;

const productSchema = z.object({
  sku: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(60),
  price: z.union([z.string(), z.number()]).transform(value => String(value))
    .pipe(z.string().regex(/^(0|[1-9]\d{0,7})(\.\d{1,2})?$/)),
  quantity: z.number().int().min(0).max(1000000)
}).strict();

function readPositiveInt(raw, fieldName, maximum = 2147483647) {
  const value = String(raw);
  if (!/^[1-9]\d*$/.test(value)) {
    throw new BadRequestException(`${fieldName} must be a positive integer`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed > maximum) {
    throw new BadRequestException(`${fieldName} is out of range`);
  }
  return parsed;
}

function parseProduct(body) {
  try {
    const validated = productSchema.parse(body);
    return { ...validated, sku: validated.sku.toUpperCase() };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestException({
        message: 'Please correct the product fields',
        errors: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    throw error;
  }
}

class ProductsService {
  constructor(database) {
    this.db = database;
  }

  async list(query = {}) {
    const search = typeof query.search === 'string' ? query.search.trim() : '';
    const category = typeof query.category === 'string' ? query.category.trim() : '';
    if (search.length > 100 || category.length > 60) {
      throw new BadRequestException('Search or category is too long');
    }
    const page = readPositiveInt(query.page ?? 1, 'page', 100000);
    const limit = readPositiveInt(query.limit ?? 8, 'limit', 50);
    const offset = (page - 1) * limit;

    let where = ' WHERE 1=1';
    const parameters = [];
    if (search) {
      where += ' AND (name LIKE ? OR sku LIKE ?)';
      parameters.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      where += ' AND category = ?';
      parameters.push(category);
    }

    const [countRows] = await this.db.execute(
      `SELECT COUNT(*) AS total FROM products${where}`, parameters
    );
    const [rows] = await this.db.execute(
      `SELECT id, sku, name, category, price, quantity, created_at, updated_at
       FROM products${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...parameters, limit, offset]
    );

    const total = Number(countRows[0].total);
    return { data: rows, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async getOne(id) {
    const validId = readPositiveInt(id, 'id');
    const [rows] = await this.db.execute(
      'SELECT id, sku, name, category, price, quantity FROM products WHERE id = ?',
      [validId]
    );
    if (!rows.length) throw new NotFoundException('Product not found');
    return rows[0];
  }

  async categories() {
    const [rows] = await this.db.execute(
      'SELECT DISTINCT category FROM products ORDER BY category'
    );
    return rows.map(row => row.category);
  }

  async summary() {
    const [totals] = await this.db.execute(`
      SELECT COUNT(*) AS totalProducts,
        COALESCE(SUM(quantity), 0) AS totalUnits,
        COALESCE(SUM(CASE WHEN quantity = 0 THEN 1 ELSE 0 END), 0) AS outOfStock,
        COALESCE(SUM(CASE WHEN quantity > 0 AND quantity <= 5 THEN 1 ELSE 0 END), 0) AS lowStock,
        COALESCE(SUM(price * quantity), 0) AS inventoryValue
      FROM products
    `);
    const [categories] = await this.db.execute(`
      SELECT category, COUNT(*) AS products, COALESCE(SUM(quantity),0) AS units
      FROM products GROUP BY category ORDER BY products DESC, category
    `);
    return {
      totalProducts: Number(totals[0].totalProducts),
      totalUnits: Number(totals[0].totalUnits),
      outOfStock: Number(totals[0].outOfStock),
      lowStock: Number(totals[0].lowStock),
      inventoryValue: totals[0].inventoryValue,
      categories: categories.map(category => ({
        category: category.category,
        products: Number(category.products),
        units: Number(category.units)
      }))
    };
  }

  async create(body) {
    const product = parseProduct(body);
    try {
      const [result] = await this.db.execute(
        'INSERT INTO products (sku, name, category, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [product.sku, product.name, product.category, product.price, product.quantity]
      );
      return { message: 'Product created', product: await this.getOne(result.insertId) };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ConflictException('SKU already exists');
      throw error;
    }
  }

  async update(id, body) {
    const validId = readPositiveInt(id, 'id');
    const product = parseProduct(body);
    try {
      const [result] = await this.db.execute(
        'UPDATE products SET sku=?, name=?, category=?, price=?, quantity=? WHERE id=?',
        [product.sku, product.name, product.category, product.price, product.quantity, validId]
      );
      if (!result.affectedRows) {
        const [rows] = await this.db.execute(
          'SELECT id FROM products WHERE id = ?',
          [validId]
        );
        if (!rows.length) throw new NotFoundException('Product not found');
      }
      return { message: 'Product updated', product: await this.getOne(validId) };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ConflictException('SKU already exists');
      throw error;
    }
  }

  async remove(id) {
    const validId = readPositiveInt(id, 'id');
    const [result] = await this.db.execute(
      'DELETE FROM products WHERE id=?', [validId]
    );
    if (!result.affectedRows) throw new NotFoundException('Product not found');
    return { message: 'Product deleted', id: validId };
  }
}

Inject(DatabaseService)(ProductsService, undefined, 0);
Injectable()(ProductsService);

export { ProductsService };
