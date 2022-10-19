import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../../auth/guards/ws-auth.guard';
import { ChatService } from '../chat.service';

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

  @SubscribeMessage('sendMessage')
  public handleMessage(socket: Socket, message: string): void {
    if (hasUser(socket.handshake)) {
      const userId = socket.handshake.user.id;
      const createdMessage = this.chatService.saveMessage({
        messageText: message,
        userId,
      });
        
      this.server.emit('newMessage', createdMessage);
    }
  }
}

function hasUser(arg: unknown): arg is { user: { id: string } } {
  return Object.prototype.hasOwnProperty.call(arg, 'user');
}
