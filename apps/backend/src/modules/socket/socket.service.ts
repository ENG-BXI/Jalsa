import {Server} from 'socket.io';
import {verifyToken} from '../../lib/jwt.js';

export class SocketService {
  private io: Server;
  private usersMapper: Record<string, string> = {};
  constructor(io: Server) {
    this.io = io;
    this.setup();
  }
  setup() {
    this.io.on('connection', socket => {
      const token = socket.handshake.auth.token;
      const user = token ? verifyToken(token) : undefined;
      this.usersMapper[user?.id as string] = socket.id as string;
      socket.on('disconnect', reason => {
        delete this.usersMapper[socket.id];
      });
    });
  }
  emit(event: string, ...args: any[]) {
    this.io.emit(event, ...args);
  }
  emitToUser({userId, event, args}: {userId?: string; event: string; args: any[]}) {
    if (!userId) return;
    const socketId = this.usersMapper[userId];
    this.io.to(socketId).emit(event, ...args);
  }
  emitToChannel(channel: string, event: string, ...args: any[]) {
    this.io.to(channel).emit(event, ...args);
  }
  emitToServer(serverId: string, event: string, ...args: any[]) {
    this.io.to(serverId).emit(event, ...args);
  }
}
