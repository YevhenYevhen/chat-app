import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { UserAlreadyExistsException } from './errors/user-already-exists.exception';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  public async findOneBy(options: Partial<User>): Promise<User> {
    const user = (await this.userRepo.findOneBy(options)) as UserDocument;
    if (user) return user.toJSON() as User;
  }

  public findOneByWithPassword(options: Partial<User>): Promise<User> {
    return this.userRepo.findOneBy(options);
  }

  public async create({ username, password }: CreateUserDto): Promise<User> {
    const user = await this.findOneBy({ username });

    if (user) throw new UserAlreadyExistsException();

    const hashedPassword = await bcrypt.hashSync(password, 10);
    return this.userRepo.create({ username, password: hashedPassword });
  }

  public find(): Promise<UserDto[]> {
    return this.userRepo.findAll();
  }

  public async update(id: string, dto: UpdateUserDto): Promise<void> {
    await this.userRepo.update(id, dto);
  }
}
