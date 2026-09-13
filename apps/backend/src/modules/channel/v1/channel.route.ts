import {Router} from 'express';
import {ChannelController} from './channel.controller.js';

export class ChannelRoute {
  private router: Router;
  constructor(private channelController: ChannelController) {
    this.channelController = channelController;
    this.router = Router();
  }
  getRoutes() {
    return this.router;
  }
}
