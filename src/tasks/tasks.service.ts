import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/classes/class';
import { ClassesService } from 'src/classes/classes.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

import { Task } from './task';

@Injectable()
export class TasksService {

    constructor(@InjectRepository(Task) private taskRepository: Repository<Task>, private userService: UserService, private classService: ClassesService) { }

    async createTask(userId: number, _classId: number, task: Task): Promise<Task> {
        const author = await this.userService.getUser(userId);
        const newTask = await this.taskRepository.save({ ...task, author: author });

        const _class: Class = await this.classService.getClass(_classId, { relations: ['tasks'] });

        if (!_class.tasks) {
            _class.tasks = [];
        }
        if (!_class.tasks.find(c => c.id == _classId)) {
            _class.tasks.push(newTask);
        }

        await this.classService.saveClass(_class);
        throw new HttpException('Task created', 201);
    }
}