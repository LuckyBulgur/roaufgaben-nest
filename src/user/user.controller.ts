import { Body, Controller, Get, HttpException, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from 'src/auth/utils/get-user-id.decorator';
import { Class } from 'src/classes/class';
import { DeleteResult } from 'typeorm';

import { lowUser, User } from './user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(@Body() user: User): Promise<User> {
        if (await this.userService.checkIfUserExists(user.username)) {
            throw new HttpException('Dieser Benutzername ist bereits vergeben', 400);
        }
        return this.userService.createUser(user);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getUser(@GetCurrentUserId() userId: number): Promise<lowUser> {
        return this.userService.getResponseObject(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/delete')
    deleteUser(@GetCurrentUserId() userId: number): Promise<DeleteResult> {
        return this.userService.deleteUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/change-password')
    changePassword(@GetCurrentUserId() userId: number, @Body() data): Promise<User> {
        return this.userService.changePassword(userId, data.password);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/join/:classUUID")
    joinClass(@GetCurrentUserId() userId: number, @Param('classUUID', ParseUUIDPipe) _classUUID: string): Promise<any> {
        return this.userService.joinClass(userId, _classUUID);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/classes')
    getClasses(@GetCurrentUserId() userId: number): Promise<Class[]> {
        return this.userService.getClass(userId);
    }
}
