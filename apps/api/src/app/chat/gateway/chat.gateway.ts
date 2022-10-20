import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../../auth/guards/ws-auth.guard';
import { ChatService } from '../chat.service';
import { hasUser } from '../typeguards/has-user.type-guard';
import { NewMessageDto } from '../dto/new-message.dto';
import { WsValidationPipe } from '../pipes/ws-validation.pipe';
import { Message, MessageDocument } from '../message.schema';
import { MessageWithUserDto } from '../dto/message-with-user.dto';

@WebSocketGateway({ cors: true })
@UseGuards(WsAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  private server: Server;

  handleConnection() {
    console.log('connected');
  }

  handleDisconnect() {
    console.log('disconnected');
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('sendMessage')
  public async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(new WsValidationPipe({ transform: true }))
    { message: messageText }: NewMessageDto
  ): Promise<void> {
    if (hasUser(client.handshake)) {
      const userId = client.handshake.user.id;

      const { id: messageId } = await this.chatService.createMessage({
        messageText,
        user: userId,
      });

      this.server.emit('userMuted', userId);
      setTimeout(() => this.server.emit('userUnmuted', userId), 15000);

      const messageWithUser = await this.chatService.getMessageWithUserById(
        messageId
      );

      this.server.emit('newMessage', this.normalizeMessage(messageWithUser));
    }
  }

  private normalizeMessage(messageObj: Message): MessageWithUserDto {
    const { user, ...message } = (messageObj as MessageDocument).toObject();

    return {
      messageText: message.messageText,
      id: message._id.toString(),
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      user: { username: user.username, id: user._id.toString() },
    };
  }
}
