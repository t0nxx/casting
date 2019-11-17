import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { ActivityController } from '../controllers/ActivityController';

const router = Router();
const activityController = new ActivityController();

router.get('/', AuthMiddleWare, activityController.getAllActivity);
router.post('/', AuthMiddleWare, activityController.AddNewActivity);
router.get('/saved', AuthMiddleWare, activityController.getAllBookmarkedActivity);
router.post('/:id/like', AuthMiddleWare, activityController.LikeActivity);
router.post('/:id/unlike', AuthMiddleWare, activityController.DisLikeActivity);
router.post('/:id/bookmark', AuthMiddleWare, activityController.BookmarkActivity);

router.put('/:id/media', AuthMiddleWare, activityController.UpdateMediaToActivity);



export default router;
