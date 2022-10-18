import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(
    @Body(ValidationPipe) user: CreateUserDto
  ): Promise<void> {
    await this.userService.create(user);
  }
}
