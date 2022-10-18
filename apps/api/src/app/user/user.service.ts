import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { UserAlreadyExistsException } from './errors/user-already-exists.exception';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  public findOneBy(options: Partial<User>): Promise<User> {
    return this.userRepo.findOneBy(options);
  }

  public async create({ username, password }: CreateUserDto): Promise<User> {
    const user = await this.findOneBy({ username });

    if (user) throw new UserAlreadyExistsException();

    const hashedPassword = await bcrypt.hashSync(password, 10);
    return this.userRepo.create({ username, password: hashedPassword });
  }
}
