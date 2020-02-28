import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';

const router = Router();
const chatController = new ChatController();

router.get('/', AuthMiddleWare, chatController.getChats);
router.post('/mute/:room', AuthMiddleWare, chatController.muteChatRoom);
router.post('/unmute/:room', AuthMiddleWare, chatController.unMuteChatRoom);
router.post('/clear/:room', AuthMiddleWare, chatController.clearChatFromRoom);
router.get('/getsharedroom/:slug', AuthMiddleWare, chatController.checkIfRoomExistOrCreateNewRoom);
router.get('/:room', AuthMiddleWare, chatController.getAllMessage);
router.post('/:slug', AuthMiddleWare, chatController.sendMessage);

export default router;
