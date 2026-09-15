import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../../prisma/contract.d.ts';
import {CreateChannelDto} from './dto/create-channel.dto.js';
import {EditChannelDto} from './dto/edit-channel.dto.js';
export class ChannelRepository {
  constructor(private db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getChannelById(channelId: string) {
    return await this.db.orm.public.Channel.where({id: channelId}).first();
  }
  async getChannelByName(serverId: string, channelName: string) {
    return await this.db.orm.public.Channel.where({name: channelName, serverId}).first();
  }
  async getAllChannelsInServer(serverId: string) {
    return await this.db.orm.public.Channel.where({serverId}).all();
  }
  async createChannel(body: CreateChannelDto) {
    return await this.db.orm.public.Channel.create(body);
  }
  async editChannel(serverId: string, channelId: string, body: EditChannelDto) {
    return await this.db.orm.public.Channel.where({serverId, id: channelId}).update(body);
  }
  async deleteChannel(channelId: string) {
    return await this.db.orm.public.Channel.where({id: channelId}).delete();
  }
  async isUserInServer(userId: string, serverId: string) {
    const user = await this.db.orm.public.UserSever.where({userId, serverId}).select('userId', 'role');
    return user;
  }
}
