import {Request, Response} from 'express';
import UserService from '../user.service.js';
import {EditUserDto} from '../dto/edit-user.dto.js';
import {HttpStatus} from '../../lib/http-status.js';

class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }
  async editUser(req: Request, res: Response) {
    try {
      const body = req.body as EditUserDto;
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const editedUser = await this.userService.editUser(user.id, body);
      return res.status(HttpStatus.OK).json({message: 'Edit User Successful', data: editedUser});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN EDIT USER ', error);
      console.log('====================================');
      return res.status(HttpStatus.OK).json({message: 'Edit User Successful', data: null, error});
    }
  }
}
export default UserController;
