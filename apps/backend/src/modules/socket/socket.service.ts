import {Server} from 'socket.io';
import {verifyToken} from '../../lib/jwt.js';
import {ServerRepository} from '../server/server.repository.js';

export class SocketService {
  private io: Server;

  constructor(
    io: Server,
    private serverRepository: ServerRepository
  ) {
    this.io = io;
    this.setup();
  }

  setup() {
    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Unauthorized'));

        const user = verifyToken(token);
        if (!user?.id) return next(new Error('Unauthorized'));

        socket.data.userId = user.id;
        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });

    this.io.on('connection', socket => {
      const userId = socket.data.userId as string;

      socket.on('server:join', async (serverId: string) => {
        try {
          const isIn = !!(await this.serverRepository.isUserInServer(serverId, userId));
          if (isIn) socket.join(serverId);
        } catch (err) {
          console.error('server:join failed', err);
        }
      });
      socket.on('server:leave', (serverId: string) => {
        socket.leave(serverId);
      });
    });
  }
  emit(event: string, ...args: any[]) {
    this.io.emit(event, ...args);
  }
  emitToUser({userId, event, args}: {userId?: string; event: string; args: any[]}) {
    if (!userId) return;
    this.io.to(userId).emit(event, ...args);
  }
  emitToChannel(channel: string, event: string, ...args: any[]) {
    this.io.to(channel).emit(event, ...args);
  }
  emitToServer(serverId: string, event: string, ...args: any[]) {
    this.io.to(serverId).emit(event, ...args);
  }
}
