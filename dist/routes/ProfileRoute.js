"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfileController_1 = require("../controllers/ProfileController");
const CompanyController_1 = require("../controllers/CompanyController");
const AuthMiddleWare_1 = require("../middlewares/AuthMiddleWare");
const FriendsController_1 = require("../controllers/FriendsController");
const ActivityController_1 = require("../controllers/ActivityController");
const router = express_1.Router();
const profileController = new ProfileController_1.ProfileController();
const companyController = new CompanyController_1.CompanyController();
const friendsController = new FriendsController_1.FriendsController();
const activityController = new ActivityController_1.ActivityController();
router.get('/lookups', profileController.getLookups);
router.get('/:slug', AuthMiddleWare_1.AuthMiddleWare, profileController.getProfile);
router.get('/:slug/settings', AuthMiddleWare_1.AuthMiddleWare, profileController.getProfileSettings);
router.get('/:slug/companies', companyController.getAllCompanies);
router.get('/:slug/friends-request', AuthMiddleWare_1.AuthMiddleWare, friendsController.getAllFriendsRequest);
router.get('/:slug/friends', AuthMiddleWare_1.AuthMiddleWare, friendsController.getAllFriends);
router.get('/:slug/album', AuthMiddleWare_1.AuthMiddleWare, profileController.getProfileAlbums);
router.get('/:slug/album/profile', AuthMiddleWare_1.AuthMiddleWare, (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.status(200).send({ s: true });
}));
router.get('/:slug/activity', AuthMiddleWare_1.AuthMiddleWare, activityController.getActivityOfUser);
router.get('/:slug/video', AuthMiddleWare_1.AuthMiddleWare, activityController.getActivityOfUser);
router.get('/:slug/audio', AuthMiddleWare_1.AuthMiddleWare, activityController.getActivityOfUser);
router.post('/:slug/hobbies', AuthMiddleWare_1.AuthMiddleWare, profileController.addHobbies);
router.post('/:slug/training', AuthMiddleWare_1.AuthMiddleWare, profileController.addTaninig);
router.post('/:slug/social', AuthMiddleWare_1.AuthMiddleWare, profileController.addSocialNetwork);
router.post('/:slug/companies', AuthMiddleWare_1.AuthMiddleWare, companyController.createCompany);
router.post('/:slug/friends', AuthMiddleWare_1.AuthMiddleWare, friendsController.sendFriendRequest);
router.post('/:slug/friends/accept', AuthMiddleWare_1.AuthMiddleWare, friendsController.acceptFriendRequest);
router.post('/:slug/friends/reject', AuthMiddleWare_1.AuthMiddleWare, friendsController.rejectFriendRequest);
router.delete('/:slug/friends', AuthMiddleWare_1.AuthMiddleWare, friendsController.deleteFriend);
router.put('/:slug/training/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.updateTaninig);
router.put('/:slug/social/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.updateSocialNetwork);
router.patch('/:slug/settings', AuthMiddleWare_1.AuthMiddleWare, profileController.updateProfileSettings);
router.patch('/:slug/update', AuthMiddleWare_1.AuthMiddleWare, profileController.updateProfile);
router.patch('/:slug/avatar', AuthMiddleWare_1.AuthMiddleWare, profileController.updateAvatar);
router.patch('/:slug/cover', AuthMiddleWare_1.AuthMiddleWare, profileController.updateCover);
router.post('/:slug/cover/reset', AuthMiddleWare_1.AuthMiddleWare, profileController.resetCover);
router.delete('/:slug/training/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.deleteTaninig);
router.delete('/:slug/hobbies/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.deleteHobbies);
exports.default = router;
//# sourceMappingURL=ProfileRoute.js.map