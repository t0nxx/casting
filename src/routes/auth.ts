import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';

const router = Router();

router.post('/login', authController.login);
router.post('/registration', authController.signUp);
router.get('/registration/activation/:token', authController.activateAccount);
router.post('/password/change', AuthMiddleWare, authController.changePassword);
router.post('/facebook', authController.LoginWithFacebook);
router.post('/google', authController.LoginWithGoogle);
router.post('/apple', authController.LoginWithApple);
export default router;
