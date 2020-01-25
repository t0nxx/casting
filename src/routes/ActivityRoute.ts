import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { ActivityController } from '../controllers/ActivityController';
import { CommentController } from '../controllers/CommentController';

const router = Router();
const activityController = new ActivityController();
const commentController = new CommentController();

router.get('/', AuthMiddleWare, activityController.getAllActivityTest);
router.post('/', AuthMiddleWare, activityController.AddNewActivity);
router.get('/saved', AuthMiddleWare, activityController.getAllBookmarkedActivity);
router.get('/:id', AuthMiddleWare, activityController.getOneActivity);
router.post('/:id/like', AuthMiddleWare, activityController.LikeActivity);
router.post('/:id/unlike', AuthMiddleWare, activityController.DisLikeActivity);
router.post('/:id/bookmark', AuthMiddleWare, activityController.BookmarkActivity);
router.post('/:id/report', AuthMiddleWare, activityController.reportActivity);
router.post('/:id/hide', AuthMiddleWare, activityController.HideActivity);
router.delete('/:id/delete', AuthMiddleWare, activityController.deleteActivity);
router.delete('/:id/deleteImg/:imgId', AuthMiddleWare, activityController.reomveImageFromAlbum);
router.get('/:id/comments', AuthMiddleWare, commentController.getAllCommentsOfACtivity);

router.get('/:id/comments/:comId/replies', AuthMiddleWare, commentController.getAllRepliesOfComment);

router.post('/:id/comments', AuthMiddleWare, commentController.createComment);

router.put('/:id/comments/:comId', AuthMiddleWare, commentController.updateComment);

router.delete('/:id/comments/:comId', AuthMiddleWare, commentController.removeComment);

router.put('/:id/media', AuthMiddleWare, activityController.UpdateMediaToActivity);



export default router;
