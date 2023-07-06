import { Injectable } from '@nestjs/common';
import { createClient, EntryCollection } from 'contentful';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  private readonly client;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      space: 'z3sl7il4aqdc',
      accessToken: this.configService.get('CONTENTFUL_PUBLISHED'),
    });
  }

  public async get(searchArgs: string): Promise<EntryCollection<any>> {
    const response = await this.client.getEntries({
      content_type: 'product',
      skip: 0,
      limit: 12,
    });

    if (searchArgs.length > 0) {
      const filteredItems = response.items.filter((item) =>
        item.fields.title.toLowerCase().includes(searchArgs.toLowerCase()),
      );
      return filteredItems;
    }
    const items = await response.items.map((item) => item);
    return items;
  }

  public async getById(id: string, main: string): Promise<any> {
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
