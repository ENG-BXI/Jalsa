import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../../prisma/contract.d.ts';
import {CreateServerDto} from './dto/create-server.dto.js';
import {TUserRole} from '../../enum/user.role.js';
import {EditServerDto} from './dto/edit-server.dto.js';
import {or} from '@prisma/orm-postgres/orm-client';
import {Temporal} from 'temporal-polyfill';
export class ServerRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getServerById(id: string) {
    return await this.db.orm.public.Server.where({id}).first();
  }
  async getServerByName(name: string, userId: string) {
    return await this.db.orm.public.Server.where({name})
      .include('userSevers', col => {
        return col.where({userId}).select('role');
      })
      .first();
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
  async getAllPublicServer(search?: string) {
    let query = this.db.sql.public.userSever
      .innerJoin(this.db.sql.public.server, (f, fns) => fns.eq(f.userSever.serverId, f.server.id))
      .select((f, fns) => ({
        id: f.server.id,
        name: f.server.name,
        description: f.server.description,
        avatar_url: f.server.avatar_url,
        memberCount: fns.count(f.userSever.id)
      }))
      .where((f, fns) => fns.eq(f.server.isPublic, true));

    if (search?.trim()) {
      const value = `%${search.trim()}%`;

      query = query.where((f, fns) =>
        fns.or(
          fns.ilike(f.server.name, value),
          fns.ilike(
            fns.raw`COALESCE(${f.server.description}, '')`.returns({
              codecId: 'pg/text@1',
              nullable: false
            }),
            value
          )
        )
      );
    }

    const builtQuery = query
      .groupBy(f => f.server.id)
      .orderBy('memberCount', {direction: 'desc'})
      .build();

    return await this.db.runtime().query(builtQuery);
  }
  async createServer(userId: string, body: CreateServerDto, serverImage?: string) {
    const newServer = await this.db.orm.public.Server.select('id', 'name', 'description', 'isPublic').create({
      ...body,
      owner_id: userId,
      avatar_url: serverImage
    });
    return newServer;
  }
  async addUserToServer(userId: string, serverId: string, role: TUserRole = 'MEMBER') {
    const addedUserToServer = await this.db.orm.public.UserSever.select('createdAt')
      .include('server', c => c.select('name'))
      .create({userId, serverId, role: role});
    return addedUserToServer;
  }
  async getNumberOfMembersInServer(serverId: string) {
    const count = await this.db.orm.public.Server.where({id: serverId})
      .include('userSevers', c => c.select('id').count())
      .select('id')
      .first();
    return count;
  }
  async isServerHasInviteCodeAvailable(serverId: string, isMultiple: boolean = false) {
    const invite = await this.db.orm.public.ServerInvite.where(p => p.serverId.eq(serverId))
      .where(p => p.expiresAt.gt(Temporal.Now.instant()))
      .where(p => p.isMultiple.eq(isMultiple))
      .where(p => p.usedAt.isNull())
      .select('code', 'expiresAt', 'isMultiple')
      .first();
    return invite;
  }
  async generateInviteCode(serverId: string, isMultiple: boolean = false) {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = Temporal.Now.instant().add({
      hours: 7 * 24 // add 7 days to the current date
    });
    const newInvite = await this.db.orm.public.ServerInvite.select('code', 'expiresAt', 'isMultiple').create({code: inviteCode, serverId, expiresAt, isMultiple});
    return newInvite;
  }
  async getInviteCode(inviteCode: string, serverId: string) {
    const invite = await this.db.orm.public.ServerInvite.where({code: inviteCode, serverId}).first();
    return invite;
  }
  async inValidInvite(inviteCode: string) {
    const invite = await this.db.orm.public.ServerInvite.where({code: inviteCode}).update({usedAt: Temporal.Now, expiresAt: Temporal.Now});
    return invite;
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
  async changeRoleInServer(serverId: string, memberId: string, role: TUserRole) {
    const changedRole = await this.db.orm.public.UserSever.where({userId: memberId, serverId}).update({role});
    return changedRole;
  }
  async isUserIsAdminOrAdminOfServer(userId: string, serverId: string) {
    const user = await this.db.orm.public.UserSever.where({userId, serverId}).first();
    const isUserAdminOrAdmin = user?.role == 'ADMIN' || user?.role == 'OWNER';
    return isUserAdminOrAdmin;
  }
  async getRoleOfUser(userId: string, serverId: string) {
    const user = await this.db.orm.public.UserSever.where({userId, serverId}).first();
    return user?.role;
  }
}
