import { Router } from 'express';
import ProfileRouter from './ProfileRoute';
import AuthRouter from './auth';
import ApiRouter from './ApiRoute';
import CompaniesRouter from './CompaniesRoute';
import { AuthController } from '../controllers/AuthController';

const routes = Router();
const authController = new AuthController();
// not known prefix
// routes.post('/api-token-verify', authController.verifyToken);

routes.use('/auth', AuthRouter);
routes.use('/profile', ProfileRouter);
routes.use('/api', ApiRouter);
routes.use('/companies', CompaniesRouter);


export default routes;
