import {Request, Response} from 'express';
import UserService from '../user.service.js';

class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }
}
export default UserController;
