import { db } from '../../prisma/db.js';
import {ServerRepository} from '../server.repository.js';
import {ServerService} from '../server.service.js';
import {ServerController} from './server.controller.js';
import {ServerRoute} from './server.route.js';

const serverRepository = new ServerRepository(db);
const serverService = new ServerService(serverRepository);
const serverController = new ServerController(serverService);
const serverRoute = new ServerRoute(serverController).getRoutes();

export default serverRoute;
