import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './roles.enum';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async create(CreateUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(CreateUserDto);

    if (!(await this.userModel.countDocuments())) {
      createdUser.role = Roles.Admin;
    }

    return createdUser.save();
  }

  
  public findOneBy(options: Partial<User>): Promise<User> {
    let searchOptions = options as FilterQuery<UserDocument>;

    if ('id' in options) {
      searchOptions = { _id: searchOptions.id };
    }

    return this.userModel.findOne(searchOptions).exec();
  }

  public async findAll(): Promise<UserDto[]> {
    return (await this.userModel.find().exec()).map((u) =>
      u.toJSON()
    ) as UserDto[];
  }

  public async update(id: string, dto: UpdateUserDto): Promise<void> {
    await this.userModel.updateOne({ _id: id }, dto);
  }
}
