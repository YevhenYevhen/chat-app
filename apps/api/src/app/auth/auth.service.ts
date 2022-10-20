import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoggedInUserDto } from '../user/dto/logged-in-user.dto';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { WrongCredentialsException } from './errors/wrong-credentials.exception';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  public async login({
    username,
    password,
  }: LoginDto): Promise<LoggedInUserDto> {
    const { id } = await this.validateUser(username, password);

    return { id, username, token: this.createToken(id) };
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneBy({ username });

    if (!user) throw new NotFoundException('User Not Found');

    this.validatePassword(password, user.password);

    return user;
  }

  private validatePassword(decoded: string, encoded: string): void {
    if (!bcrypt.compareSync(decoded, encoded)) {
      throw new WrongCredentialsException();
    }
  }

  private createToken(id: string): string {
    return this.jwtService.sign({ id });
  }
}
