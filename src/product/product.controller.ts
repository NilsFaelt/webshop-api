import { Controller, Get, Injectable, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { IsPublic } from 'src/auth/common';
@Injectable()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @IsPublic()
  @Get('')
  public async get(
    @Query() args: { title: string; category: string },
  ): Promise<any> {
    console.log(args);
    return this.productService.get(args);
  }
  @IsPublic()
  @Get('/:id')
  public async getById(@Param('id') id: string, @Query('main') main: string) {
    return this.productService.getById(id, main);
  }
}
