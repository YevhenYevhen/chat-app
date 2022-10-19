import { Body, Controller, Post } from '@nestjs/common';
import { LoggedInUserDto } from '../user/dto/logged-in-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public login(@Body() body: LoginDto): Promise<LoggedInUserDto> {
    return this.authService.login(body);
  }
}
