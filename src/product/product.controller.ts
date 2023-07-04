import { Controller, Get, Injectable, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
@Injectable()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  public async get() {
    return this.productService.get();
  }
  @Get('/:id')
  public async getById(@Param('id') id: string) {
    return this.productService.getById(id);
  }
}
