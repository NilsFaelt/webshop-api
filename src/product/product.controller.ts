import { Controller, Get, Injectable, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
@Injectable()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  public async get(@Query('searchArgs') searchArgs: string): Promise<any> {
    return this.productService.get(searchArgs);
  }
  @Get('/:id')
  public async getById(@Param('id') id: string, @Query('main') main: string) {
    return this.productService.getById(id, main);
  }
}
