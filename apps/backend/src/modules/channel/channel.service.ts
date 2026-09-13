import {ChannelRepository} from './channel.repository.js';

export class ChannelService {
  constructor(private channelRepository: ChannelRepository) {
    this.channelRepository = channelRepository;
  }
}
