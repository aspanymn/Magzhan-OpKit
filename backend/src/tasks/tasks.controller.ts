import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@GetUser() user: any) {
    return this.tasksService.getTasks(user.id);
  }

  @Get(':id')
  async getTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    return this.tasksService.getTask(id, user.id);
  }

  @Post()
  async createTask(@Body() dto: CreateTaskDto, @GetUser() user: any) {
    return this.tasksService.createTask(user.id, dto);
  }

  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @GetUser() user: any,
  ) {
    return this.tasksService.updateTask(id, user.id, dto);
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    return this.tasksService.deleteTask(id, user.id);
  }
}
