import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class TasksGateway {
  @WebSocketServer()
  server!: Server;

  @OnEvent('task.created')
  handleTaskCreated(task: any) {
    this.server.emit('task:created', task);
  }

  @OnEvent('task.updated')
  handleTaskUpdated(task: any) {
    this.server.emit('task:updated', task);
  }

  @OnEvent('task.deleted')
  handleTaskDeleted(task: any) {
    this.server.emit('task:deleted', task);
  }
}
