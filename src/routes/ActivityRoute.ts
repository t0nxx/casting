import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { ActivityController } from '../controllers/ActivityController';

const router = Router();
const activityController = new ActivityController();

router.get('/', AuthMiddleWare, activityController.getAllActivityTest);
router.post('/', AuthMiddleWare, activityController.AddNewActivity);
router.get('/saved', AuthMiddleWare, activityController.getAllBookmarkedActivity);
router.post('/:id/like', AuthMiddleWare, activityController.LikeActivity);
router.post('/:id/unlike', AuthMiddleWare, activityController.DisLikeActivity);
router.post('/:id/bookmark', AuthMiddleWare, activityController.BookmarkActivity);
router.post('/:id/hide', AuthMiddleWare, activityController.HideActivity);

router.put('/:id/media', AuthMiddleWare, activityController.UpdateMediaToActivity);



export default router;
