import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities';
import { UserService } from './services/user.service';
import { BcryptPasswordHasher } from './services/hash-password.service';
import {
  CheckUserExistService,
  GenerateToken,
  LoginService,
  MatchPassword,
} from './services/login';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('TOKEN_EXPIRATION'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    BcryptPasswordHasher,
    LoginService,
    GenerateToken,
    CheckUserExistService,
    MatchPassword,
    JwtStrategy,
  ],
})
export class AuthModule {}
