import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { SessionsModule } from 'src/sessions/sessions.module';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    SessionsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    RateLimiterModule.register({
      keyPrefix: 'login',
      points: 20,
      duration: 600,
      errorMessage: 'Zu viele anfragen, bitte versuche es später erneut.',
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
