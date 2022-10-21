import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoggedInUserDto } from './dto/logged-in-user.dto';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { WrongCredentialsException } from './errors/wrong-credentials.exception';
import { LoginDto } from './dto/login.dto';
import { UserBannedException } from './errors/user-banned.exception';

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
    const { id, role } = await this.validateUser(username, password);

    return { id, username, role, token: this.createToken(id) };
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByWithPassword({ username });

    if (!user) throw new NotFoundException('User Not Found');

    if (user.banned) throw new UserBannedException();

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
