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
import { UserService } from '../user.service';
import { hasId } from '../../shared/typeguards/has-id.type-guard';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { UserDto } from '../dto/user.dto';

@WebSocketGateway({ cors: true })
@UseFilters(new BaseWsExceptionFilter())
@UseGuards(WsAuthGuard, RolesGuard)
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private sockets: Socket[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  @WebSocketServer()
  private server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    const currentUserToken = client.handshake.query.token as string;
    const currentUserId = this.getId(this.jwtService.decode(currentUserToken));

    this.sockets.forEach((s) => {
      const savedId = this.getId(
        this.jwtService.decode(s.handshake.query.token as string)
      );

      if (savedId && currentUserId && savedId === currentUserId) {
        s.disconnect();
      }
    });

    this.sockets.push(client);
    this.getOnlineUsers();
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.sockets = this.sockets.filter((c) => c.id !== client.id);
    this.getOnlineUsers();
  }

  @SubscribeMessage('muteUser')
  @Roles('admin')
  public async muteUser(@MessageBody() id: string): Promise<void> {
    await this.userService.update(id, { muted: true });

    this.server.emit('userMuted');
  }

  @SubscribeMessage('unmuteUser')
  @Roles('admin')
  public async unmuteUser(@MessageBody() id: string): Promise<void> {
    await this.userService.update(id, { muted: false });

    this.server.emit('userUnmuted');
  }

  @SubscribeMessage('banUser')
  @Roles('admin')
  public async banUser(@MessageBody() id: string): Promise<void> {
    await this.userService.update(id, { banned: true });

    this.server.emit('userBanned');
  }

  @SubscribeMessage('unbanUser')
  @Roles('admin')
  public async unbanUser(@MessageBody() id: string): Promise<void> {
    await this.userService.update(id, { banned: false });

    this.server.emit('userUnbanned');
  }

  @SubscribeMessage('getOnlineUsers')
  @Roles('user')
  public async getOnlineUsers(): Promise<void> {
    const tokens = this.sockets.map((s) => s.handshake.query.token as string);
    const onlineUsers: UserDto[] = [];

    for (const token of tokens) {
      const id = this.getId(this.jwtService.decode(token));
      const user = await this.userService.findOneBy({ id });
      onlineUsers.push(user);
    }

    this.server.emit('onlineUsers', onlineUsers);
  }

  @Roles('admin')
  @SubscribeMessage('getAllUsers')
  public async getAllUsers(): Promise<void> {
    const allUsers: UserDto[] = await this.userService.find();

    const onlineUsersIds = this.sockets.map(({ handshake }) =>
      this.getId(this.jwtService.decode(handshake.query.token as string))
    );

    for (const user of allUsers) {
      user.online = onlineUsersIds.includes(user.id);
    }

    this.server.emit('allUsers', allUsers);
  }

  private getId(obj: unknown): string | null {
    if (!hasId(obj)) return null;

    return obj.id;
  }
}
