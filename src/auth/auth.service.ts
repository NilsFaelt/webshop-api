import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

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
    await this.updateRefreshTokenHash(createdUser.id, tokens.refresh_token);
    return tokens;
  }

  public async signIn(dto: AuthDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user)
      throw new HttpException('User did not exsist', HttpStatus.NOT_FOUND);
    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches)
      throw new HttpException('Wrong credentials', HttpStatus.FORBIDDEN);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  public async loggout(id: number) {
    await this.prismaService.user.updateMany({
      where: { id: id, hashedRt: { not: null } },
      data: {
        hashedRt: null,
      },
    });
  }

  public async refresh(id: number, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    console.log(refreshToken, user, ' in brcypt');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRt,
    );
    if (!refreshTokenMatches)
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hasehData(data: string) {
    return bcrypt.hash(data, 10);
  }
  async getTokens(userId: number, email: string) {
    const [accesToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email: email },
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

    return { access_token: accesToken, refresh_token: refreshToken };
  }
  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await this.hasehData(refreshToken);
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        hashedRt: hash,
      },
    });
  }
}
