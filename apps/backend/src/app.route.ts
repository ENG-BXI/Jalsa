import {Router} from 'express';
export class AppRouter {
  private appRouter;
  constructor(private v1Route: Router) {
    this.appRouter = Router();
    this.appRouter.use('/v1', v1Route);
  }
  getRoutes() {
    return this.appRouter;
  }
}
