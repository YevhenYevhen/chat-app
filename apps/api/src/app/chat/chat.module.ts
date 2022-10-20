import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './gateway/chat.gateway';
import { Message, MessageSchema } from './message.schema';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { ChatRepository } from './chat.repository';

@Module({
  providers: [ChatGateway, ChatService, ChatRepository],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    AuthModule,
  ],
})
export class ChatModule {}
