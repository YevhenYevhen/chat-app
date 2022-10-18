import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../user/user.repository';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, UserRepository, LocalStrategy],
})
export class AuthModule {}
