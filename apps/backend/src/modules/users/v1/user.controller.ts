import {Request, Response} from 'express';
import UserService from '../user.service.js';
import {EditUserDto} from '../dto/edit-user.dto.js';
import {HttpStatus} from '../../../lib/http-status.js';

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
      const data = await this.userService.editUser(user.id, user, body);
      return res.status(HttpStatus.OK).json({message: 'Edit User Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN EDIT USER ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Edit User Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Edit User Failed', error: 'Unknown error'});
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const deletedUser = await this.userService.deleteUser(user.id);
      return res.status(HttpStatus.OK).json({message: 'Delete User Successful', deletedUser});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Delete USER ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Delete User Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Delete User Failed', error: 'Unknown error'});
    }
  }
}
export default UserController;
