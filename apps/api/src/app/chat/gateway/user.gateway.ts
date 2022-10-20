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
import { UserService } from '../../user/user.service';

@WebSocketGateway({ cors: true })
@UseGuards(WsAuthGuard)
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UserService) {}
  @WebSocketServer()
  private server: Server;

  handleConnection() {
    console.log('connected');
  }

  handleDisconnect() {
    console.log('disconnected');
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('muteUser')
  public async muteUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: string
  ): Promise<void> {
    await this.userService.mute(id);

    this.server.emit('userMuted');
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('unmuteUser')
  public async unmuteUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: string
  ): Promise<void> {
    await this.userService.unmute(id);

    this.server.emit('userUnmuted');
  }
}
