import {Router} from 'express';
import {ServerController} from './server.controller.js';

export class ServerRoute {
  private serverController: ServerController;
  private router: Router;
  constructor(serverController: ServerController) {
    this.serverController = serverController;
    this.router = Router();
  }
  getRoutes() {
    return this.router;
  }
}
