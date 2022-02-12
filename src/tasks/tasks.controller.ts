import { Body, Controller, Get, Post, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from 'src/auth/utils/get-user-id.decorator';
import { Task } from './task';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {

    constructor(private taskService: TasksService) { }

    @Post("/create/:classId")
    createTask(@GetCurrentUserId() userId: number, @Param('classId', ParseIntPipe) classId: number, @Body() task: Task): Promise<Task> {
        return this.taskService.createTask(userId, classId, task);
    }
}