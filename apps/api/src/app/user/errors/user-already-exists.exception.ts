import { HttpStatus, HttpException } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User already exists', HttpStatus.CONFLICT);
  }
}
