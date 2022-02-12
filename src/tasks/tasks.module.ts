import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task';
import { User } from 'src/user/user';
import { Class } from 'src/classes/class';
import { UserModule } from 'src/user/user.module';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule, ClassesModule],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService]
})
export class TasksModule { }
