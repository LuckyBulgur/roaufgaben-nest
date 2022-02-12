import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from 'src/auth/utils/get-user-id.decorator';
import { Task } from 'src/tasks/task';
import { DeleteResult, UpdateResult } from 'typeorm';

import { Class } from './class';
import { ClassesService } from './classes.service';

@Controller('class')
@UseGuards(JwtAuthGuard)
export class ClassesController {

    constructor(private readonly classService: ClassesService) { }

    @Post("/create")
    createClass(@GetCurrentUserId() userId: number, @Body() _class: Class): Promise<Class> {
        return this.classService.createClass(userId, _class);
    }

    @Get("/tasks/:id")
    getTasks(@GetCurrentUserId() userId: number, @Param("id", ParseIntPipe) classId: number): Promise<Task[]> {
        return this.classService.getTasks(classId, userId);
    }

    @Get("/tasks")
    getAllTasks(@GetCurrentUserId() userId: number): Promise<Task[]> {
        return this.classService.getAllTasks(userId);
    }

    @Get('/newtasks')
    getNewestTasks(@GetCurrentUserId() userId: number): Promise<Task[]> {
        return this.classService.getNewestTasks(userId);
    }

    @Post('/update/:id')
    updateClass(@GetCurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number, @Body() _class: Class): Promise<UpdateResult> {
        return this.classService.updateClass(userId, id, _class);
    }

    @Post('/delete/:id')
    deleteClass(@GetCurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return this.classService.deleteClass(userId, id);
    }
}
