import { Controller, Get, Injectable, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard, GetCurrentUserId, IsPublic } from 'src/auth/common';
import { UserService } from './user.service';

@Injectable()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AccessTokenGuard)
  @Get()
  public async find(@GetCurrentUserId('sub') id: number) {
    return this.userService.find(id);
  }
}
