import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/registration', authController.signUp);
router.post('/password/change', AuthMiddleWare, authController.changePassword);
router.post('/facebook', authController.LoginWithFacebook);
router.post('/google', authController.LoginWithGoogle);
export default router;
