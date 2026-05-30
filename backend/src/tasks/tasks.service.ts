import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getTasks(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getTask(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You cannot access this task');
    }

    return task;
  }

  async createTask(userId: number, dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId,
      },
    });

    this.eventEmitter.emit('task.created', task);

    return task;
  }

  async updateTask(id: number, userId: number, dto: UpdateTaskDto) {
    const task = await this.getTask(id, userId);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title ?? task.title,
        description: dto.description ?? task.description,
        status: dto.status ?? task.status,
      },
    });

    this.eventEmitter.emit('task.updated', updatedTask);

    return updatedTask;
  }

  async deleteTask(id: number, userId: number) {
    await this.getTask(id, userId);

    const deletedTask = await this.prisma.task.delete({
      where: { id },
    });

    this.eventEmitter.emit('task.deleted', deletedTask);

    return deletedTask;
  }
}
