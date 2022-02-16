import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

import { Sessions } from './sessions';
import { SessionsService } from './sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sessions]), UserModule],
  providers: [SessionsService],
  exports: [SessionsService]
})
export class SessionsModule { }
