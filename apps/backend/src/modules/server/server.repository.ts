import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../../prisma/contract.d.ts';
import {CreateServerDto} from './dto/create-server.dto.js';
import {TUserRole} from '../../enum/user.role.js';
import {EditServerDto} from './dto/edit-server.dto.js';

export class ServerRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getServerById(id: string) {
    return await this.db.orm.public.Server.where({id}).first();
  }
  async getServerByName(name: string) {
    return await this.db.orm.public.Server.where({name}).first();
  }
  async getAllServerForMember(userId: string) {
    return await this.db.orm.public.UserSever.where({userId})
      .select('role')
      .include('server', c => {
        return c.select('id', 'name', 'avatar_url');
      })
      .all();
  }
  async getAllMemberInMyServer(serverId: string) {
    return await this.db.orm.public.UserSever.where({serverId})
      .select('role')
      .include('user', c => {
        return c.select('id', 'name', 'userName', 'jointAt');
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
  async editServer(serverId: string, editServerDto: EditServerDto) {
    const editedServer = await this.db.orm.public.Server.where({id: serverId}).select('id', 'name', 'description', 'isPublic').update(editServerDto);
    return editedServer;
  }
  async deleteServer(serverId: string) {
    const deletedServer = await this.db.orm.public.Server.where({id: serverId}).select('id', 'name', 'description', 'isPublic').delete();
    return deletedServer;
  }
  async isUserInServer(serverId: string, userId: string) {
    const existUserInServer = await this.db.orm.public.UserSever.where({serverId, userId}).select('role').first();
    return existUserInServer;
  }
  async leaveUserFromServer(serverId: string, userId: string) {
    const leaveUser = await this.db.orm.public.UserSever.where({userId, serverId}).delete();
    return leaveUser;
  }
}
