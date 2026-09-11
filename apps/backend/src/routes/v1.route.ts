import {Router} from 'express';
import {userRouteV1} from '../users/v1/index.js';
import {authMiddleWare} from '../middlewares/auth.middleware.js';

const v1Route = Router();
// All V1 Route Here For All Modules ....

v1Route.use('/user', authMiddleWare, userRouteV1);

export default v1Route;
