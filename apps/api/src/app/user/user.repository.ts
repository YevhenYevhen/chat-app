import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(CreateUserDto);
    return createdUser.save();
  }

  async findOneBy(options: Partial<User>): Promise<User> {
    let searchOptions = options as FilterQuery<UserDocument>;

    if ('id' in options) {
      searchOptions = { _id: searchOptions.id };
    }
    return this.userModel.findOne(searchOptions).exec();
  }

  async mute(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { muted: true });
  }

  async unmute(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { muted: false });
  }
}
