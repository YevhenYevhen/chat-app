import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(15)
  password: string;
}
