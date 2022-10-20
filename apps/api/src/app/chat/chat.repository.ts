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

  public getMessageWithUserById(id: string): Promise<Message> {
    return this.messageModel
      .findOne({ _id: id })
      .populate('user', ['username', 'id'])
      .exec();
  }
}
