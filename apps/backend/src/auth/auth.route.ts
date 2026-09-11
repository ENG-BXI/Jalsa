import {Router} from 'express';
import {AuthController} from './auth.controller.js';
import {ValidationMiddleware} from '../middlewares/validation.middleware.js';
import {LoginDtoSchema} from './dto/login.dto.js';
import {RegisterDtoSchema} from './dto/register.dto.js';
import {authMiddleWare} from '../middlewares/auth.middleware.js';

class AuthRouter {
  private authController: AuthController;
  private router = Router();
  constructor(authController: AuthController) {
    this.authController = authController;
    this.router.post('/login', ValidationMiddleware(LoginDtoSchema), (req, res) => this.authController.login(req, res));
    this.router.post('/register', ValidationMiddleware(RegisterDtoSchema), (req, res) => this.authController.register(req, res));
    this.router.get('/me', authMiddleWare, (req, res) => this.authController.me(req, res));
  }
  getRoutes() {
    return this.router;
  }
}
export default AuthRouter;
