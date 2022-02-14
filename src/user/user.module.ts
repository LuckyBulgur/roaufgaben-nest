import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesModule } from 'src/classes/classes.module';

import { User } from './user';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClassesModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
