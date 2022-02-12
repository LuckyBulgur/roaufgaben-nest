import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user';
import { ClassesModule } from 'src/classes/classes.module';
import { Class } from 'src/classes/class';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClassesModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
