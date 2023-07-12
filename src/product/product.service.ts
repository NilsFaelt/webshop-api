import { Injectable } from '@nestjs/common';
import { createClient, EntryCollection } from 'contentful';
import { ConfigService } from '@nestjs/config';
import { ProductType } from './types.ts';

@Injectable()
export class ProductService {
  private readonly client;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      space: 'z3sl7il4aqdc',
      accessToken: this.configService.get('CONTENTFUL_PUBLISHED'),
    });
  }

  public async get(args: {
    title: string;
    category: string;
  }): Promise<ProductType[]> {
    const response = await this.client.getEntries({
      content_type: 'product',
      skip: 0,
      limit: 12,
    });

    if (args.category) {
      const words = args.category
        .split(/\s*,\s*/)
        .map((word) => word.toLowerCase());
      const filteredByCategory = response.items.filter((each) => {
        if (each.fields.category.some((word) => words.includes(word))) {
          return each;
        }
      });
      return filteredByCategory;
    }

    if (args?.title?.length > 0) {
      const filteredItems = response.items.filter((item) =>
        item.fields.title.toLowerCase().includes(args.title.toLowerCase()),
      );
      return filteredItems;
    }
    const items = await response.items.map((item) => item);
    return items;
  }

  public async getById(id: string, main: string): Promise<ProductType> {
    if (main === 'true') {
      const response = await this.client.getEntries({
        content_type: 'productMainDisplay',
      });

      const items = await response.items.map((item) => item);
      return items[0];
    }

    const response = await this.client.getEntry(id);
    return response;
  }
}
