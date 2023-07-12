import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  public async find(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    console.log(user);
    if (!user) throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    return user;
  }
}
