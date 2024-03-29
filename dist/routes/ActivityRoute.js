"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleWare_1 = require("../middlewares/AuthMiddleWare");
const ActivityController_1 = require("../controllers/ActivityController");
const CommentController_1 = require("../controllers/CommentController");
const advertisements_1 = require("../controllers/dashboard/advertisements");
const router = express_1.Router();
const activityController = new ActivityController_1.ActivityController();
const commentController = new CommentController_1.CommentController();
const advertisementController = new advertisements_1.AdvertisementController();
router.get('/', AuthMiddleWare_1.AuthMiddleWare, activityController.getAllActivityTest);
router.get('/advertisement', AuthMiddleWare_1.AuthMiddleWare, advertisementController.getAllAdvertisement);
router.post('/', AuthMiddleWare_1.AuthMiddleWare, activityController.AddNewActivity);
router.get('/saved', AuthMiddleWare_1.AuthMiddleWare, activityController.getAllBookmarkedActivity);
router.get('/:id', AuthMiddleWare_1.AuthMiddleWare, activityController.getOneActivity);
router.post('/:id/like', AuthMiddleWare_1.AuthMiddleWare, activityController.LikeActivity);
router.post('/:id/unlike', AuthMiddleWare_1.AuthMiddleWare, activityController.DisLikeActivity);
router.post('/:id/bookmark', AuthMiddleWare_1.AuthMiddleWare, activityController.BookmarkActivity);
router.post('/:id/report', AuthMiddleWare_1.AuthMiddleWare, activityController.reportActivity);
router.post('/:id/hide', AuthMiddleWare_1.AuthMiddleWare, activityController.HideActivity);
router.delete('/:id/delete', AuthMiddleWare_1.AuthMiddleWare, activityController.deleteActivity);
router.delete('/:id/removefromalbum', AuthMiddleWare_1.AuthMiddleWare, activityController.reomveImageFromAlbum);
router.get('/:id/comments', AuthMiddleWare_1.AuthMiddleWare, commentController.getAllCommentsOfACtivity);
router.get('/:id/comments/:comId/replies', AuthMiddleWare_1.AuthMiddleWare, commentController.getAllRepliesOfComment);
router.post('/:id/comments', AuthMiddleWare_1.AuthMiddleWare, commentController.createComment);
router.put('/:id/comments/:comId', AuthMiddleWare_1.AuthMiddleWare, commentController.updateComment);
router.delete('/:id/comments/:comId', AuthMiddleWare_1.AuthMiddleWare, commentController.removeComment);
router.put('/:id/media', AuthMiddleWare_1.AuthMiddleWare, activityController.UpdateMediaToActivity);
exports.default = router;
//# sourceMappingURL=ActivityRoute.js.map