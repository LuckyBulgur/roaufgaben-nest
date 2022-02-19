import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task';
import { User } from 'src/user/user';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { Class } from './class';

@Injectable()
export class ClassesService {

    constructor(@InjectRepository(Class) private classes: Repository<Class>, @InjectRepository(User) private userRepo: Repository<User>, @InjectRepository(Task) private taskRepo: Repository<Task>) {
    }

    async createClass(userId: number, _class: Class): Promise<Class> {
        const creator = await this.userRepo.findOne(userId);
        const class_ = await this.classes.save({ ..._class, creator: creator });

        const user: User = await this.userRepo.findOne(userId, { relations: ['class'] });

        if (!user.class) {
            user.class = [];
        }
        if (!user.class.find(c => c.id == class_.id)) {
            user.class.push(class_);
        }

        await this.userRepo.save(user);
        throw new HttpException('Class created', 201);
    }

    async getClassByUUID(uuid: string): Promise<Class> {
        return await this.classes.findOne({ link: uuid });
    }

    async getClass(id: number | string, options?: {}): Promise<Class> {
        return await this.classes.findOne(id, options);
    }

    async getAllTasks(userId: number): Promise<Task[]> {
        const _class: Class[] = (await this.userRepo.findOne(userId, { relations: ['class'] })).class;

        let tasks: Task[] = [];
        for (let i = 0; i < _class.length; i++) {
            const task: Task[] = await this.getTasks(_class[i].id, userId);
            for (let j = 0; j < task.length; j++) {
                task[j].author = (await this.userRepo.findOne({ username: task[j].author.username })).toResponseObject();
                tasks.push(task[j]);
            }
        }

        tasks.sort((a, b) => a.submission.getTime() - b.submission.getTime());

        return tasks;
    }

    async getNewestTasks(userId: number): Promise<Task[]> {
        const _class: Class[] = (await this.userRepo.findOne(userId, { relations: ['class'] })).class;

        let tasks: Task[] = [];
        console.time();
        for (let i = 0; i < _class.length; i++) {
            const task: Task[] = await this.getTasks(_class[i].id, userId);
            for (let j = 0; j < task.length; j++) {
                task[j].author = (await this.userRepo.findOne({ username: task[j].author.username })).toResponseObject();
                tasks.push(task[j]);
            }
        }
        console.timeEnd();

        tasks.sort((a, b) => b.reg_date.getTime() - a.reg_date.getTime());

        return tasks;
    }

    async getTasks(classId: number, userId: number): Promise<Task[]> {
        const user = await this.userRepo.findOne(userId, { relations: ['class'] });
        const _class: Class = await this.classes.findOne(classId, { relations: ['tasks'] });

        if (user.class && user.class.find(c => c.id == classId)) {
            let tasks: Task[] = [];
            for (let i = 0; i < _class.tasks.length; i++) {
                const task = await this.taskRepo.findOne(_class.tasks[i].id, { relations: ['author'] });
                if (task.submission > new Date()) {
                    task.author = (await this.userRepo.findOne({ username: task.author.username })).toResponseObject();
                    tasks.push(task);
                }
            }

            tasks.sort((a, b) => a.submission.getTime() - b.submission.getTime());

            return tasks;
        } else {
            throw new UnauthorizedException();
        }
    }

    async saveClass(_class: Class): Promise<Class> {
        return await this.classes.save(_class);
    }

    async update(_class: Class): Promise<UpdateResult> {
        return await this.classes.update(_class, {
            tasks: _class.tasks
        });
    }

    async updateClass(userId: number, id: number, _class: Class): Promise<UpdateResult> {
        const user = await this.userRepo.findOne(userId);
        const class_ = await this.classes.findOne(id);
        if (class_.creator == user.toResponseObject()) {
            return await this.classes.update(id, _class);
        } else {
            throw new UnauthorizedException();
        }
    }

    async deleteClass(userId: number, id: number): Promise<DeleteResult> {
        const user = await this.userRepo.findOne(userId);
        const class_ = await this.classes.findOne(id);
        if (class_.creator == user.toResponseObject()) {
            return await this.classes.delete(id);
        } else {
            throw new UnauthorizedException();
        }
    }
}
