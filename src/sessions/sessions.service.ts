import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

import { Sessions } from './sessions';

@Injectable()
export class SessionsService {

    constructor(@InjectRepository(Sessions) private sessionRepository: Repository<Sessions>, private userService: UserService) { }

    async createSession(userId: number, session: {}): Promise<User> {
        const user = await this.userService.getUser(userId, { relations: ['sessions'] });
        const newSession = await this.sessionRepository.save(session);

        if (!user.sessions) {
            user.sessions = [];
        }
        if (!user.sessions.find(c => c.id == userId)) {
            user.sessions.push(newSession);
        }

        return await this.userService.saveUser(user);
    }
}
