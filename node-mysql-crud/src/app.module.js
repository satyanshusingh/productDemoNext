import nestCommon from '@nestjs/common';
import { DatabaseService } from './database.service.js';
import { ProductsService } from './products.service.js';
import { ProductsController } from './controllers/products.controller.js';

const { Module } = nestCommon;

class AppModule {}

Module({
  controllers: [ProductsController],
  providers: [DatabaseService, ProductsService]
})(AppModule);

export { AppModule };
