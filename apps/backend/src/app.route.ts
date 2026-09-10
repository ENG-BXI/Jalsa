import {Router} from 'express';
import v1Route from './routes/v1.route.js';

const appRouter = Router();

appRouter.use('/v1', v1Route);

export default appRouter;
