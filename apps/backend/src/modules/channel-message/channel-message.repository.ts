import {PostgresClient} from '@prisma/orm-postgres/runtime';
import {Contract} from '../../prisma/contract.js';
import {MessageDto} from './dto/message-dto.dto.js';

export class ChannelMessageRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getAllMessage(channelId: string) {
    const allMessage = await this.db.orm.public.ChannelMassage.where({channelId}).all();
    const allMessageWithoutDeleteMessage = allMessage.map(message => {
      if (message.softDelete) {
        const {text, imageUrl, ...softMessage} = message;
        return softMessage;
      }
      return message;
    });
    return allMessageWithoutDeleteMessage;
  }
  async sendMessage(userId: string, channelId: string, message: MessageDto) {
    const sendedMessage = await this.db.orm.public.ChannelMassage.create({from: userId, channelId, text: message.text, imageUrl: message.imageUrl});
    return sendedMessage;
  }
  async editMessage(userId: string, channelId: string, messageId: string, message: MessageDto) {
    const editedMessage = await this.db.orm.public.ChannelMassage.where({from: userId, channelId, id: messageId}).update({text: message.text, imageUrl: message.imageUrl, updatedAt: Date.now()});
    return editedMessage;
  }
}
