import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { activityController } from '../controllers/ActivityController';
import { commentController } from '../controllers/CommentController';
import { advertisementController } from '../controllers/dashboard/advertisements';

const router = Router();

router.get('/', AuthMiddleWare, activityController.getAllActivityTest);
router.get('/advertisement', AuthMiddleWare, advertisementController.getAllAdvertisement);
router.post('/', AuthMiddleWare, activityController.AddNewActivity);
router.get('/saved', AuthMiddleWare, activityController.getAllBookmarkedActivity);
router.get('/:id', AuthMiddleWare, activityController.getOneActivity);
router.post('/:id/like', AuthMiddleWare, activityController.LikeActivity);
router.post('/:id/unlike', AuthMiddleWare, activityController.DisLikeActivity);
router.post('/:id/bookmark', AuthMiddleWare, activityController.BookmarkActivity);
router.post('/:id/report', AuthMiddleWare, activityController.reportActivity);
router.post('/:id/hide', AuthMiddleWare, activityController.HideActivity);
router.delete('/:id/delete', AuthMiddleWare, activityController.deleteActivity);
router.delete('/:id/removefromalbum', AuthMiddleWare, activityController.reomveImageFromAlbum);
router.get('/:id/comments', AuthMiddleWare, commentController.getAllCommentsOfACtivity);

router.get('/:id/comments/:comId/replies', AuthMiddleWare, commentController.getAllRepliesOfComment);

router.post('/:id/comments', AuthMiddleWare, commentController.createComment);

router.put('/:id/comments/:comId', AuthMiddleWare, commentController.updateComment);

router.delete('/:id/comments/:comId', AuthMiddleWare, commentController.removeComment);

router.put('/:id/media', AuthMiddleWare, activityController.UpdateMediaToActivity);



export default router;
