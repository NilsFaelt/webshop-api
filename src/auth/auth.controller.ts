import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { serialize } from 'cookie';

import {
  GetCurrentUser,
  GetCurrentUserId,
  IsPublic,
  RefreshTokenGuard,
} from './common';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Res } from '@nestjs/common';

@IsPublic()
@Injectable()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  public async signUp(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(authDto);

    return res.send(tokens);
  }
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  public async signIn(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(authDto);

    return res.send(tokens);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/loggout')
  public async loggout(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUserId() id: number,
  ) {
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

// setCookies(res: Response, tokens: any) {
//   const threeDaysInSeconds = 3 * 24 * 60 * 60; // 3 days in seconds
//   const expirationDate = new Date(Date.now() + threeDaysInSeconds * 1000);
//   res.setHeader('Set-Cookie', [
//     serialize('accessToken', tokens.access_token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//       domain: 'localhost',
//       expires: expirationDate,
//     }),
//     serialize('refreshToken', tokens.refresh_token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//       domain: 'localhost',
//       expires: expirationDate,
//     }),
//   ]);
// }
