import {Request, Response} from 'express';
import {AuthServices} from './auth.services.js';
import {LoginDto} from './dto/login.dto.js';
import {HttpStatus} from '../../lib/http-status.js';
import {RegisterDto} from './dto/register.dto.js';

export class AuthController {
  private authServices: AuthServices;
  constructor(authServices: AuthServices) {
    this.authServices = authServices;
  }
  async login(req: Request, res: Response) {
    try {
      const body = req.body as LoginDto;
      const token = await this.authServices.login(body);
      return res.status(HttpStatus.OK).json({message: 'Login Successful', data: token});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR in LOGIN', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Login Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Login Failed', error: 'Unknown error'});
    }
  }
  async register(req: Request, res: Response) {
    try {
      const body = req.body as RegisterDto;
      const newUserAndToken = await this.authServices.register(body);
      return res.status(HttpStatus.OK).json({message: 'Register Successful', data: newUserAndToken});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR in Register', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Register Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Register Failed', error: 'Unknown error'});
    }
  }
  async me(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      return res.status(HttpStatus.OK).json({message: 'Get User Me Successful', data: user});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR in Me', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Me Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Me Failed', error: 'Unknown error'});
    }
  }
  async isUserNameAvailable(req: Request, res: Response) {
    try {
      const {userName} = req.body as {userName: string};
      const data = await this.authServices.isUserNameAvailable(userName);
      return res.status(HttpStatus.OK).json({message: 'Is UserName Available Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Is UserName Available ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Is UserName Available Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Is UserName Available Failed', error: 'Unknown error'});
    }
  }
}
