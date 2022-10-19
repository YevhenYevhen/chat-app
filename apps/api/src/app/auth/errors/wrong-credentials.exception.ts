import { ForbiddenException } from "@nestjs/common";

export class WrongCredentialsException extends ForbiddenException {
  constructor() {
    super('Username or password is not valid');
  }
}
