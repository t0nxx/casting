"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleWare_1 = require("../middlewares/AuthMiddleWare");
const ActivityController_1 = require("../controllers/ActivityController");
const router = express_1.Router();
const activityController = new ActivityController_1.ActivityController();
router.get('/', AuthMiddleWare_1.AuthMiddleWare, activityController.getAllActivityTest);
router.post('/', AuthMiddleWare_1.AuthMiddleWare, activityController.AddNewActivity);
router.get('/saved', AuthMiddleWare_1.AuthMiddleWare, activityController.getAllBookmarkedActivity);
router.post('/:id/like', AuthMiddleWare_1.AuthMiddleWare, activityController.LikeActivity);
router.post('/:id/unlike', AuthMiddleWare_1.AuthMiddleWare, activityController.DisLikeActivity);
router.post('/:id/bookmark', AuthMiddleWare_1.AuthMiddleWare, activityController.BookmarkActivity);
router.post('/:id/hide', AuthMiddleWare_1.AuthMiddleWare, activityController.HideActivity);
router.put('/:id/media', AuthMiddleWare_1.AuthMiddleWare, activityController.UpdateMediaToActivity);
exports.default = router;
//# sourceMappingURL=ActivityRoute.js.map