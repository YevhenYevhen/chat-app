import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './gateway/chat.gateway';
import { Message, MessageSchema } from './message.schema';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { ChatRepository } from './chat.repository';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { User, UserSchema } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    ChatGateway,
    ChatService,
    ChatRepository,
    UserService,
    UserRepository,
    JwtService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
})
export class ChatModule {}
