import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user';
import { Task } from 'src/tasks/task';

@Module({
  imports: [TypeOrmModule.forFeature([Class, User, Task])],
  providers: [ClassesService],
  controllers: [ClassesController],
  exports: [ClassesService]
})
export class ClassesModule { }
