import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../prisma/contract.d.ts';
import {CreateServerDto} from './dto/create-server.dto.js';
import {TUserRole} from '../enum/user.role.js';

export class ServerRepository {
  db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getServerById(id: string) {
    return await this.db.orm.public.Server.where({id}).first();
  }
  async getAllServerForMember(userId: string) {
    return await this.db.orm.public.UserSever.where({userId})
      .select('role')
      .include('server', c => {
        return c.select('id', 'name', 'avatar_url');
      })
      .all();
  }
  async getAllPublicServer() {
    return await this.db.orm.public.Server.where({isPublic: true}).select('id', 'name', 'description', 'avatar_url').all();
  }

  async createServer(userId: string, body: CreateServerDto) {
    //TODO: Implement Avatar Server
    const newServer = await this.db.orm.public.Server.select('id', 'name', 'description', 'isPublic').create({
      ...body,
      admin_id: userId
    });
    return newServer;
  }
  async addUserToServer(userId: string, serverId: string, role: TUserRole = 'MEMBER') {
    const addedUserToServer = await this.db.orm.public.UserSever.select('createdAt')
      .include('server', c => c.select('name'))
      .create({userId, serverId, role: role});
    return addedUserToServer;
  }
}
