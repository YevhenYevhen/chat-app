import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { ChatRepository } from './chat.repository';
import { SaveMessageDto } from './dto/save-message.dto';
import { UserIsMutedException } from './errors/user-is-muted.exception';
import { Message } from './message.schema';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly userRepo: UserRepository
  ) {}

  public async createMessage(dto: SaveMessageDto): Promise<Message> {
    const user = await this.userRepo.findOneBy({ id: dto.user });

    if (user.muted) throw new UserIsMutedException();

    this.handleMuteAfterMessageSent(dto.user);

    return this.chatRepo.create(dto);
  }

  public getMessageWithUserById(id: string): Promise<Message> {
    return this.chatRepo.getMessageWithUserById(id);
  }

  private handleMuteAfterMessageSent(id: string): void {
    this.userRepo.mute(id);

    setTimeout(() => this.userRepo.unmute(id), 15000);
  }
}
