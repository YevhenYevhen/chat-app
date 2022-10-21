import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SaveMessageDto } from './dto/save-message.dto';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  public create(dto: SaveMessageDto): Promise<Message> {
    return this.messageModel.create(dto);
  }

  public async getMessageWithUserById(id: string): Promise<Message> {
    return (
      await this.messageModel
        .findById(id)
        .populate('user', ['username', 'id'])
        .exec()
    ).toJSON() as Message;
  }

  public findAll(): Promise<MessageDocument[]> {
    return (
      this.messageModel
        .find({}, { __v: 0 })
        .populate('user', ['username', 'id'])
        .sort({ date: -1 })
        .exec()
    );
  }
}
