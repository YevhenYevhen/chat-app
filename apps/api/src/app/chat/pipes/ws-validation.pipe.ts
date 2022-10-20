import {
  ArgumentMetadata,
  HttpException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export class WsValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }
  async transform(
    value: unknown,
    metadata: ArgumentMetadata
  ): Promise<unknown> {
    try {
      return await super.transform(value, metadata);
    } catch (e: unknown) {
      if (e instanceof HttpException) {
        throw new WsException(e.getResponse());
      }

      throw e;
    }
  }
}
