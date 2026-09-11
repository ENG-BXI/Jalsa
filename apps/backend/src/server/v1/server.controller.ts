import {ServerService} from '../server.service.js';

export class ServerController {
  private serverService: ServerService;
  constructor(serverService: ServerService) {
    this.serverService = serverService;
  }
}
