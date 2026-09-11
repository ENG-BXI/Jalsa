import {db} from '../prisma/db.js';
import UserRepository from '../users/user.repository.js';
import {AuthController} from './auth.controller.js';
import {AuthRepository} from './auth.repository.js';
import AuthRouter from './auth.route.js';
import {AuthServices} from './auth.services.js';

const authRepository = new AuthRepository(db);
const userRepository = new UserRepository(db);
const authServices = new AuthServices(authRepository, userRepository);
const authController = new AuthController(authServices);
const authRoute = new AuthRouter(authController).getRoutes();
export default authRoute;
