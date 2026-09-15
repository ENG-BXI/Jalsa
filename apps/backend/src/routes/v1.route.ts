import {Router} from 'express';
import {userRouteV1} from '../modules/users/v1/index.js';
import {authMiddleWare} from '../middlewares/auth.middleware.js';
import authRoute from '../modules/auth/index.js';
import serverRoute from '../modules/server/v1/index.js';
import channelRoute from '../modules/channel/v1/index.js';
import directMessageRoute from '../modules/direct-message/v1/index.js';
import channelMessageRoute from '../modules/channel-message/v1/index.js';

const v1Route = Router();
// All V1 Route Here For All Modules ....

v1Route.use('/auth', authRoute);
v1Route.use('/user', authMiddleWare, userRouteV1);
v1Route.use('/server', serverRoute);
v1Route.use('/channel', channelRoute);
v1Route.use('/direct-message', directMessageRoute);
v1Route.use('/channel-message', channelMessageRoute);

export default v1Route;
