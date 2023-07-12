import { Controller, Get, Injectable, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { IsPublic } from 'src/auth/common';
import { ProductType } from './types.ts';
@Injectable()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @IsPublic()
  @Get('')
  public async get(
    @Query() args: { title: string; category: string },
  ): Promise<ProductType[]> {
    return this.productService.get(args);
  }
  @IsPublic()
  @Get('/:id')
  public async getById(
    @Param('id') id: string,
    @Query('main') main: string,
  ): Promise<ProductType> {
    return this.productService.getById(id, main);
  }
}
