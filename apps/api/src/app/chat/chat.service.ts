import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SaveMessageDto } from './dto/save-message.dto';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  public saveMessage(dto: SaveMessageDto): Promise<Message> {
    return this.messageModel.create({ ...dto, date: new Date().toISOString() });
  }
}
