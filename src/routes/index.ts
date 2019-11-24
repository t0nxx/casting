import { Router } from 'express';
import ProfileRouter from './ProfileRoute';
import AuthRouter from './auth';
import ApiRouter from './ApiRoute';
import CompaniesRouter from './CompaniesRoute';
import ChatRouter from './ChatRoute';
import AdminRouter from './AdminRoute';
import ActivityRouter from './ActivityRoute';
import SearchyRouter from './SearchRoute';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { ActivityController } from '../controllers/ActivityController';

const routes = Router();
const authController = new AuthController();
const activityController = new ActivityController();
// not known prefix
routes.post('/api-token-verify', authController.verifyToken);
routes.post('/password/reset', authController.resetPassword);
routes.post('/password/reset/confirm', authController.resetPasswordConfirm);

// // activities
// routes.get('/activity', AuthMiddleWare, activityController.getAllActivity);
// routes.post('/activity', AuthMiddleWare, activityController.AddNewActivity);

routes.use('/auth', AuthRouter);
routes.use('/profile', ProfileRouter);
routes.use('/api', ApiRouter);
routes.use('/companies', CompaniesRouter);
routes.use('/chat', ChatRouter);
routes.use('/admin', AdminRouter);
routes.use('/activity', ActivityRouter);
routes.use('/search', SearchyRouter);

export default routes;
