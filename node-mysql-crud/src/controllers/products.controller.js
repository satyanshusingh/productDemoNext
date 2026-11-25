import nestCommon from '@nestjs/common';
import { ProductsService } from '../products.service.js';

const {
  Controller,
  Inject,
  Injectable,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body
} = nestCommon;

class ProductsController {
  constructor(productsService) {
    this.products = productsService;
  }

  list(query) {
    return this.products.list(query);
  }

  categories() {
    return this.products.categories();
  }

  summary() {
    return this.products.summary();
  }

  getOne(id) {
    return this.products.getOne(id);
  }

  create(body) {
    return this.products.create(body);
  }

  update(id, body) {
    return this.products.update(id, body);
  }

  remove(id) {
    return this.products.remove(id);
  }
}

const prototype = ProductsController.prototype;
Controller('api/products')(ProductsController);
Injectable()(ProductsController);
Inject(ProductsService)(ProductsController, undefined, 0);

Get()(prototype, 'list', Object.getOwnPropertyDescriptor(prototype, 'list'));
Query()(prototype, 'list', 0);
Get('categories')(prototype, 'categories', Object.getOwnPropertyDescriptor(prototype, 'categories'));
Get('summary')(prototype, 'summary', Object.getOwnPropertyDescriptor(prototype, 'summary'));
Get(':id')(prototype, 'getOne', Object.getOwnPropertyDescriptor(prototype, 'getOne'));
Param('id')(prototype, 'getOne', 0);
Post()(prototype, 'create', Object.getOwnPropertyDescriptor(prototype, 'create'));
Body()(prototype, 'create', 0);
Put(':id')(prototype, 'update', Object.getOwnPropertyDescriptor(prototype, 'update'));
Param('id')(prototype, 'update', 0);
Body()(prototype, 'update', 1);
Delete(':id')(prototype, 'remove', Object.getOwnPropertyDescriptor(prototype, 'remove'));
Param('id')(prototype, 'remove', 0);

export { ProductsController };
