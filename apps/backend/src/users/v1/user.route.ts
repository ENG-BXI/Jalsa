import {Router} from 'express';
import UserController from './user.controller.js';
import {ValidationMiddleware} from '../../middlewares/validation.middleware.js';
import { EditUserDtoSchema } from '../dto/edit-user.dto.js';
class UserRoute {
  private userController;
  private router = Router();
  constructor(userController: UserController) {
    this.userController = userController;
    this.router.patch('/edit-user', ValidationMiddleware(EditUserDtoSchema), (req, res) => this.userController.editUser(req, res));
  }
  getRoutes() {
    return this.router;
  }
}
export default UserRoute;
