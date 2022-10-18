import { Body, Controller, Post } from '@nestjs/common';
import { LoggedInUserDto } from '../user/dto/logged-in-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public login(
    @Body() body: { username: string; password: string }
  ): Promise<LoggedInUserDto> {
    return this.authService.login(body);
  }
}
