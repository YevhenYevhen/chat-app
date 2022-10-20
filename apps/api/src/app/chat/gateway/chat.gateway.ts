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
    { message }: NewMessageDto
  ): Promise<void> {
    if (hasUser(client.handshake)) {
      const userId = client.handshake.user.id;

      const { id: messageId } = await this.chatService.createMessage({
        messageText: message,
        user: userId,
      });

      const messageWithUser = await this.chatService.getMessageWithUserById(messageId);

      this.server.emit('newMessage', messageWithUser);
    }
  }
}
