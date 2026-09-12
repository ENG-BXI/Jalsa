import {Router} from 'express';
import {userRouteV1} from '../users/v1/index.js';
import {authMiddleWare} from '../middlewares/auth.middleware.js';
import authRoute from '../modules/auth/index.js';
import serverRoute from '../server/v1/index.js';

const v1Route = Router();
// All V1 Route Here For All Modules ....

v1Route.use('/auth', authRoute);
v1Route.use('/user', authMiddleWare, userRouteV1);
v1Route.use('/server', serverRoute);

export default v1Route;
