"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfileController_1 = require("../controllers/ProfileController");
const CompanyController_1 = require("../controllers/CompanyController");
const AuthMiddleWare_1 = require("../middlewares/AuthMiddleWare");
const FriendsController_1 = require("../controllers/FriendsController");
const ActivityController_1 = require("../controllers/ActivityController");
const SearchController_1 = require("../controllers/SearchController");
const router = express_1.Router();
const profileController = new ProfileController_1.ProfileController();
const companyController = new CompanyController_1.CompanyController();
const friendsController = new FriendsController_1.FriendsController();
const activityController = new ActivityController_1.ActivityController();
const searchController = new SearchController_1.SearchController();
router.get('/lookups', profileController.getLookups);
router.get('/whoseeme', AuthMiddleWare_1.AuthMiddleWare, searchController.getWhoSeeMePeople);
router.get('/:slug', AuthMiddleWare_1.AuthMiddleWare, profileController.getProfile);
router.get('/:slug/settings', AuthMiddleWare_1.AuthMiddleWare, profileController.getProfileSettings);
router.get('/:slug/companies', companyController.getAllCompanies);
router.get('/:slug/friends', AuthMiddleWare_1.AuthMiddleWare, friendsController.getAllFriends);
router.get('/:slug/friends-request', AuthMiddleWare_1.AuthMiddleWare, friendsController.getAllFriendsRequest);
router.get('/:slug/friends-suggested', AuthMiddleWare_1.AuthMiddleWare, friendsController.getSuggestedFriends);
router.get('/:slug/album', AuthMiddleWare_1.AuthMiddleWare, profileController.getProfileAlbums);
router.get('/:slug/album/profile', AuthMiddleWare_1.AuthMiddleWare, activityController.getAllImagesOfUser);
router.get('/:slug/album/:id', AuthMiddleWare_1.AuthMiddleWare, activityController.getAllImagesOfAlbum);
router.get('/:slug/activity', AuthMiddleWare_1.AuthMiddleWare, activityController.getActivityOfUser);
router.get('/:slug/video', AuthMiddleWare_1.AuthMiddleWare, activityController.getAllVideoOfUser);
router.get('/:slug/audio', AuthMiddleWare_1.AuthMiddleWare, activityController.getAllAudioOfUser);
router.post('/:slug/hobbies', AuthMiddleWare_1.AuthMiddleWare, profileController.addHobbies);
router.post('/:slug/training', AuthMiddleWare_1.AuthMiddleWare, profileController.addTaninig);
router.post('/:slug/social', AuthMiddleWare_1.AuthMiddleWare, profileController.addSocialNetwork);
router.post('/:slug/companies', AuthMiddleWare_1.AuthMiddleWare, companyController.createCompany);
router.post('/:slug/friends', AuthMiddleWare_1.AuthMiddleWare, friendsController.sendFriendRequest);
router.post('/:slug/friends/friendalladmin', AuthMiddleWare_1.AuthMiddleWare, friendsController.makeAllusersFriendWithAdminForDevOnly);
router.post('/:slug/friends/unfriendalladmin', AuthMiddleWare_1.AuthMiddleWare, friendsController.removeAllusersFromFriendWithAdminForDevOnly);
router.post('/:slug/friends/accept', AuthMiddleWare_1.AuthMiddleWare, friendsController.acceptFriendRequest);
router.post('/:slug/friends/reject', AuthMiddleWare_1.AuthMiddleWare, friendsController.rejectFriendRequest);
router.post('/:slug/video', AuthMiddleWare_1.AuthMiddleWare, activityController.AddNewVideoOrAudio);
router.post('/:slug/audio', AuthMiddleWare_1.AuthMiddleWare, activityController.AddNewVideoOrAudio);
router.delete('/:slug/friends', AuthMiddleWare_1.AuthMiddleWare, friendsController.deleteFriend);
router.put('/:slug/training/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.updateTaninig);
router.put('/:slug/social/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.updateSocialNetwork);
router.patch('/:slug/settings', AuthMiddleWare_1.AuthMiddleWare, profileController.updateProfileSettings);
router.patch('/:slug/update', AuthMiddleWare_1.AuthMiddleWare, profileController.updateProfile);
router.patch('/:slug/avatar', AuthMiddleWare_1.AuthMiddleWare, profileController.updateAvatar);
router.patch('/:slug/cover', AuthMiddleWare_1.AuthMiddleWare, profileController.updateCover);
router.post('/:slug/cover/reset', AuthMiddleWare_1.AuthMiddleWare, profileController.resetCover);
router.post('/:slug/album', AuthMiddleWare_1.AuthMiddleWare, profileController.addNewlbum);
router.patch('/:slug/album/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.updateAlbum);
router.delete('/:slug/album/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.deleteAlbum);
router.post('/:slug/album/image', AuthMiddleWare_1.AuthMiddleWare, activityController.AddNewVideoOrAudio);
router.put('/:slug/album/:id/image', AuthMiddleWare_1.AuthMiddleWare, activityController.addImageToAlbum);
router.delete('/:slug/training/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.deleteTaninig);
router.delete('/:slug/hobbies/:id', AuthMiddleWare_1.AuthMiddleWare, profileController.deleteHobbies);
exports.default = router;
//# sourceMappingURL=ProfileRoute.js.map