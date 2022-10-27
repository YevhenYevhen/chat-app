import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';

export class WsAuthGuard extends AuthGuard('wsjwt') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any
  ): TUser {
    try {
      return super.handleRequest(err, user, info, context, status);
    } catch (error) {
      throw new WsException({ message: 'Unauthorized', status: 401 });
    }
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake;
  }
}
