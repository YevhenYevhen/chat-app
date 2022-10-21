import { ForbiddenException } from '@nestjs/common';

export class UserBannedException extends ForbiddenException {
  constructor() {
    super('User is banned');
  }
}
