import { Router } from 'express';
import ProfileRouter from './ProfileRoute';
import AuthRouter from './auth';
const routes = Router();

routes.use('/auth', AuthRouter);
routes.use('/profile', ProfileRouter);


export default routes;
