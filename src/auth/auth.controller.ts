import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  public async signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }
  @Post('/signin')
  public async signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
  @Post('/loggout')
  public async loggout() {
    this.authService.signOut();
  }
  @Post('/refresh')
  public async refresh() {
    this.authService.refresh();
  }
}
