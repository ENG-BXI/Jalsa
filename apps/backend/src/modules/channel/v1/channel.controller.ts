import {ChannelService} from '../channel.service.js';

export class ChannelController {
  constructor(private channelService: ChannelService) {
    this.channelService = channelService;
  }
}
