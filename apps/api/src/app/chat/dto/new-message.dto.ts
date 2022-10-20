import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class NewMessageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: string }) => value.trim())
  message: string;
}
