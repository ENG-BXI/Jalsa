import {ServerRepository} from './server.repository.js';

export class ServerService {
  private serverRepository: ServerRepository;
  constructor(serverRepository: ServerRepository) {
    this.serverRepository = serverRepository;
    }
    async getAllServerForMember(){}
}
