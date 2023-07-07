import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

import {
  GetCurrentUser,
  GetCurrentUserId,
  IsPublic,
  RefreshTokenGuard,
} from './common';
import { Injectable } from '@nestjs/common';

@IsPublic()
@Injectable()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  public async signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  public async signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/loggout')
  public async loggout(@GetCurrentUserId() id: number) {
    console.log(id);
    this.authService.loggout(id);
  }
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  public async refresh(
    @GetCurrentUserId('sub') id: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    console.log(id, refreshToken, ' in cont');
    return this.authService.refresh(id, refreshToken);
  }
}
