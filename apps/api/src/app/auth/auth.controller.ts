import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoggedInUserDto } from './dto/logged-in-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public login(@Body(ValidationPipe) body: LoginDto): Promise<LoggedInUserDto> {
    return this.authService.login(body);
  }
}
