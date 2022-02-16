import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Class } from 'src/classes/class';
import { ClassesService } from 'src/classes/classes.service';
import { Sessions } from 'src/sessions/sessions';
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

    async changePassword(userId: number, password: string): Promise<User> {
        const user: User = await this.user.findOne(userId);
        user.password = await bcrypt.hash(password, 10);
        await this.user.save(user);
        throw new HttpException('Passwort erfolgreich geändert', 201);
    }

    async deleteUser(userId: number): Promise<DeleteResult> {
        await this.user.delete(userId);
        throw new HttpException('Erfolgreich gelöscht', 201);
    }

    async checkIfUserExists(username: string): Promise<boolean> {
        const user = await this.user.findOne({ username });

        if (user) {
            return true;
        }
        return false;
    }

    async joinClass(userId: number, _classUUID: string): Promise<any> {
        const _class: Class = await this.classService.getClassByUUID(_classUUID);
        const user: User = await this.user.findOne(userId, { relations: ['class'] });

        if (!user.class) {
            user.class = [];
        }
        if (!user.class.find(c => c.link == _classUUID)) {
            user.class.push(_class);
        } else {
            throw new HttpException('Sie sind bereits in dieser Klasse', 400);
        }
        await this.user.save(user);
        return {
            message: 'Erfolgreich beigetreten',
            classId: _class.id
        }
    }

    async saveUser(user: User): Promise<User> {
        return await this.user.save(user);
    }

    async update(user: User): Promise<UpdateResult> {
        return await this.user.update(user.id, user);
    }

    async getResponseObject(id: number): Promise<lowUser> {
        return (await this.user.findOne(id)).toResponseObject();
    }

    async getUser(id: number, options?: {}): Promise<User> {
        return await this.user.findOne(id, options);
    }

    async getUserByName(username: string): Promise<User> {
        return await this.user.findOne({ where: { username: username } });
    }

    async getSessions(id: number): Promise<Sessions[]> {
        const user: User = await this.user.findOne(id, { relations: ['sessions'] });
        return user.sessions.sort((a, b) => b.reg_date.getTime() - a.reg_date.getTime());
    }

    async getClass(id: number): Promise<Class[]> {
        const user: User = await this.user.findOne(id, { relations: ['class'] });
        let classes: Class[] = [];
        for (let i = 0; i < user.class.length; i++) {
            const _class = await this.classService.getClass(user.class[i].id, { relations: ['creator'] });
            const creator = (await this.getUserByName(_class.creator.username)).toResponseObject();
            _class.creator = creator;
            if (creator.username != user.username) {
                _class.link = null
            }
            classes.push(_class);
        }

        classes.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });

        return classes;
    }
}
