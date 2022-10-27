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
import { hasUser } from '../../shared/typeguards/has-user.type-guard';
import { NewMessageDto } from '../dto/new-message.dto';
import { WsValidationPipe } from '../../shared/pipes/ws-validation.pipe';
import { JwtService } from '@nestjs/jwt';
import { hasId } from '../../shared/typeguards/has-id.type-guard';

@WebSocketGateway({ cors: true })
@UseGuards(WsAuthGuard)
@UseFilters(new BaseWsExceptionFilter())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private sockets: Socket[] = [];
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService
  ) {}
  @WebSocketServer()
  private server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    this.sockets.forEach((s) => {
      const savedToken = s.handshake.query.token as string;
      const currentUserToken = client.handshake.query.token as string;

      const savedId = this.getId(this.jwtService.decode(savedToken));
      const currentUserId = this.getId(
        this.jwtService.decode(currentUserToken)
      );

      if (savedId && currentUserId && savedId === currentUserId) {
        s.disconnect();
      }
    });

    this.sockets.push(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.sockets = this.sockets.filter((c) => c.id !== client.id);
  }

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

      this.server.emit('newMessage', messageWithUser);
    }
  }

  @SubscribeMessage('getAllMessages')
  public async getAllMessages(): Promise<void> {
    const allMessages = await this.chatService.getAllMessages();

    this.server.emit('allMessages', allMessages);
  }

  private getId(obj: unknown): string | null {
    if (!hasId(obj)) return null;

    return obj.id;
  }
}
