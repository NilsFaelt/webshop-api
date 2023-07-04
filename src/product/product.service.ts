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

  public async get(): Promise<EntryCollection<any>> {
    const response = await this.client.getEntries({
      content_type: 'product',
      skip: 0,
    });

    const items = response.items.map((item) => item);
    return items;
  }

  public async getById(id: string): Promise<any> {
    console.log(id);
    const response = await this.client.getEntry(id);
    return response.fields;
  }
}
