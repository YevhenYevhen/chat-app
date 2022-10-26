import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @Matches(/^[A-Za-z]+$/, { message: 'Username must include letters only' })
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(15)
  password: string;
}
