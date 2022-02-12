import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Class } from 'src/classes/class';
import { ClassesService } from 'src/classes/classes.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { lowUser, User } from './user';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private user: Repository<User>,
        private classService: ClassesService
    ) { }

    async createUser(user: User): Promise<User> {
        user.password = await bcrypt.hash(user.password, 10);
        await this.user.save(user);
        throw new HttpException('Erfolgreich registriert', 201);
    }

    async deleteUser(userId: number): Promise<DeleteResult> {
        return await this.user.delete(userId);
    }

    async checkIfUserExists(username: string): Promise<boolean> {
        const user = await this.user.findOne({ username });

        if (user) {
            return true;
        }
        return false;
    }

    async joinClass(userId: number, _classId: number): Promise<User> {
        const _class: Class = await this.classService.getClass(_classId);
        const user: User = await this.user.findOne(userId, { relations: ['class'] });

        if (!user.class) {
            user.class = [];
        }
        if (!user.class.find(c => c.id == _classId)) {
            user.class.push(_class);
        }
        return this.user.save(user);
    }

    async saveUser(user: User): Promise<User> {
        return await this.user.save(user);
    }

    async update(user: User): Promise<UpdateResult> {
        return await this.user.update(user.id, user);
    }

    async getResponseObject(id: number): Promise<lowUser> {
        return await (await this.user.findOne(id)).toResponseObject();
    }

    async getUser(id: number): Promise<User> {
        return await this.user.findOne(id);
    }

    async getUserByName(username: string): Promise<User> {
        return await this.user.findOne({ where: { username: username } });
    }

    async getClass(id: number): Promise<Class[]> {
        const user: User = await this.user.findOne(id, { relations: ['class'] });
        let classes: Class[] = [];
        for (let i = 0; i < user.class.length; i++) {
            const _class = await this.classService.getClass(user.class[i].id, { relations: ['creator'] });
            _class.creator = user.toResponseObject();
            classes.push(_class);
        }
        return classes;
    }
}
