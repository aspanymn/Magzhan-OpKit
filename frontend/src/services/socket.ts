import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
});

export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const onTaskCreated = (callback: (task: any) => void) => {
  socket.on('task:created', callback);
};

export const onTaskUpdated = (callback: (task: any) => void) => {
  socket.on('task:updated', callback);
};

export const onTaskDeleted = (callback: (task: any) => void) => {
  socket.on('task:deleted', callback);
};

export const removeTaskListeners = () => {
  socket.off('task:created');
  socket.off('task:updated');
  socket.off('task:deleted');
};
