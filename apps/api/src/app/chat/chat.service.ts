import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SaveMessageDto } from './dto/save-message.dto';
import { Message } from './message.schema';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepo: ChatRepository) {}

  public createMessage(dto: SaveMessageDto): Promise<Message> {
    return this.chatRepo.create(dto);
  }

  public getMessageWithUserById(id: string): Promise<Message> {
    return this.chatRepo.getMessageWithUserById(id);
  }
}
