import { Router } from 'express';
import ProfileRouter from './ProfileRoute';
import AuthRouter from './auth';
import ApiRouter from './ApiRoute';
import CompaniesRouter from './CompaniesRoute';
const routes = Router();

routes.use('/auth', AuthRouter);
routes.use('/profile', ProfileRouter);
routes.use('/api', ApiRouter);
routes.use('/companies', CompaniesRouter);


export default routes;
