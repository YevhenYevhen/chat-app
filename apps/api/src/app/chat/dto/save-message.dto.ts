import { MaxLength, IsString } from 'class-validator';

export class SaveMessageDto {
  @IsString()
  @MaxLength(200)
  messageText: string;

  @IsString()
  user: string;
}
