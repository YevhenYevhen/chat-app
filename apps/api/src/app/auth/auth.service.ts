import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoggedInUserDto } from '../user/dto/logged-in-user.dto';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  public async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<LoggedInUserDto> {
    const { password: hashedPassword, id } = await this.userService.findOneBy({
      username,
    });

    this.validatePassword(password, hashedPassword);

    return { id, username, token: this.createToken(id) };
  }

  private validatePassword(decoded: string, encoded: string): void {
    if (!bcrypt.compareSync(decoded, encoded)) {
      throw new HttpException(
        'Username or password is not valid',
        HttpStatus.FORBIDDEN
      );
    }
  }

  private createToken(id: string): string {
    return this.jwtService.sign({ id });
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneBy({ username });

    this.validatePassword(password, user.password);

    return user;
  }
}
