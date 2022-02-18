import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Class } from './classes/class';
import { ClassesModule } from './classes/classes.module';
import { Sessions } from './sessions/sessions';
import { SessionsModule } from './sessions/sessions.module';
import { Task } from './tasks/task';
import { TasksModule } from './tasks/tasks.module';
import { User } from './user/user';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Class, Task, Sessions],
      synchronize: true,
    }),
    UserModule,
    ClassesModule,
    TasksModule,
    AuthModule,
    SessionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
