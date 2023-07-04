import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  public async signUp(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hasehData(dto.password);
    const createdUser = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash: hash,
      },
    });
    const tokens = await this.getTokens(createdUser.id, createdUser.email);
    return tokens;
  }

  public async signIn() {
    return;
  }

  public async signOut() {
    return;
  }

  public async refresh() {
    return;
  }

  hasehData(data: string) {
    return bcrypt.hash(data, 10);
  }
  async getTokens(userId: number, email: string) {
    const [accesToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return { refresh_token: refreshToken, access_token: accesToken };
  }
}
