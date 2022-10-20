import { HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export class UserIsMutedException extends WsException {
  constructor() {
    super({
      status: HttpStatus.FORBIDDEN,
      message: 'Forbidden: user is muted',
    });
  }
}
