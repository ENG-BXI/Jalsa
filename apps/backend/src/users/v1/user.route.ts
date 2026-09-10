import {Router} from 'express';
import UserController from './user.controller.js';
class UserRoute {
  private userController;
  private router = Router();
  constructor(userController: UserController) {
    this.userController = userController;
    // this.router.get('/', (req, res) => this.userController.getAllUser(req, res));
  }
  getRoutes() {
    return this.router;
  }
}
export default UserRoute;
