import {Router} from 'express';
import {ServerController} from './server.controller.js';
import {authMiddleWare} from '../../../middlewares/auth.middleware.js';
import {ValidationMiddleware} from '../../../middlewares/validation.middleware.js';
import {CreateServerDtoSchema} from '../dto/create-server.dto.js';
import {EditServerDtoSchema} from '../dto/edit-server.dto.js';
import {ChangeRoleDtoSchema} from '../dto/change-role.dto.js';
import {KickUserFromServerDtoSchema} from '../dto/kick-user-from-server.dto.js';

export class ServerRoute {
  private serverController: ServerController;
  private router: Router;
  constructor(serverController: ServerController) {
    this.serverController = serverController;
    this.router = Router();
    this.router.get('/my-servers', authMiddleWare, (req, res) => this.serverController.getAllServerForMember(req, res));
    this.router.get('/number-of-members/:serverId', authMiddleWare, (req, res) => this.serverController.getNumberOfMembersInServer(req, res));
    this.router.get('/all-members/:serverId', authMiddleWare, (req, res) => this.serverController.getAllMemberInMyServer(req, res));
    this.router.get('/public-server', authMiddleWare, (req, res) => this.serverController.getAllPublicServer(req, res));
    this.router.post('/create-server', authMiddleWare, ValidationMiddleware(CreateServerDtoSchema), (req, res) => this.serverController.createServer(req, res));
    this.router.post('/add-user-to-server/:serverId', authMiddleWare, (req, res) => this.serverController.addUserToServer(req, res));
    this.router.post('/add-user-to-private-server/:serverId/:inviteCode', authMiddleWare, (req, res) => this.serverController.addUserToPrivateServerByInvite(req, res));
    this.router.post('/generate-invite-code/:serverId', authMiddleWare, (req, res) => this.serverController.generateInviteCode(req, res));
    this.router.patch('/edit-server/:serverId', authMiddleWare, ValidationMiddleware(EditServerDtoSchema), (req, res) => this.serverController.editServer(req, res));
    this.router.patch('/change-role/:serverId', authMiddleWare, ValidationMiddleware(ChangeRoleDtoSchema), (req, res) => this.serverController.changeRoleInServer(req, res));
    this.router.delete('/delete-server/:serverId', authMiddleWare, (req, res) => this.serverController.deleteServer(req, res));
    this.router.patch('/leave-user-from-server/:serverId', authMiddleWare, (req, res) => this.serverController.leaveUserFromServer(req, res));
    this.router.patch('/kick-user-from-server/:serverId', authMiddleWare, ValidationMiddleware(KickUserFromServerDtoSchema), (req, res) => this.serverController.kickedUserFromServer(req, res));
    this.router.get('/name/:serverName', authMiddleWare, (req, res) => this.serverController.getServerByName(req, res));
    this.router.get('/:serverId', authMiddleWare, (req, res) => this.serverController.getServerById(req, res));
  }
  getRoutes() {
    return this.router;
  }
}
