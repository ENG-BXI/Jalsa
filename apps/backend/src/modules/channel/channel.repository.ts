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
  async getAllChannelsInServer(serverId: string) {
    return await this.db.orm.public.Channel.where({serverId}).all();
  }
  async createChannel(body: CreateChannelDto) {
    const createdChannel = await this.db.orm.public.Channel.create(body);
    return createdChannel;
  }
  async editChannel(serverId: string, channelId: string, body: EditChannelDto) {
    const editedChannel = await this.db.orm.public.Channel.where({serverId, id: channelId}).update(body);
    return editedChannel;
  }
  async deleteChannel(channelId: string) {
    const deletedChannel = await this.db.orm.public.Channel.where({id: channelId}).delete();
    return deletedChannel;
  }
}
