import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../user/user.repository';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt-constants';
import { WsJwtStrategy } from './ws-jwt.strategy';
import { WsAuthGuard } from './guards/ws-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    LocalStrategy,
    WsJwtStrategy,
    WsAuthGuard,
  ],
  exports: [AuthService, WsAuthGuard],
})
export class AuthModule {}
