import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';

const router = Router();
const chatController = new ChatController();

router.get('/:room', AuthMiddleWare, chatController.getAllMessage);
router.post('/:slug', AuthMiddleWare, chatController.sendMessage);

export default router;
