import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { CompanyController } from '../controllers/CompanyController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { UploadToS3 } from '../helpers/awsUploader';
import { FriendsController } from '../controllers/FriendsController';
import { ActivityController } from '../controllers/ActivityController';

const router = Router();
const profileController = new ProfileController();
const companyController = new CompanyController();
const friendsController = new FriendsController();
const activityController = new ActivityController();

router.get('/lookups', profileController.getLookups);
router.get('/:slug', AuthMiddleWare, profileController.getProfile);
router.get('/:slug/settings', AuthMiddleWare, profileController.getProfileSettings);

router.get('/:slug/companies', companyController.getAllCompanies);

// get all friends request
router.get('/:slug/friends-request', AuthMiddleWare, friendsController.getAllFriendsRequest);

// get all friends
router.get('/:slug/friends', AuthMiddleWare, friendsController.getAllFriends);


// test album
router.get('/:slug/album', AuthMiddleWare, profileController.getProfileAlbums);

router.get('/:slug/album/profile?limit=true', AuthMiddleWare, async (req, res) => {
    res.status(200).send();
});

router.get('/:slug/activity', AuthMiddleWare, activityController.getActivityOfUser);
router.get('/:slug/video', AuthMiddleWare, activityController.getAllVideoOfUser);
router.get('/:slug/audio', AuthMiddleWare, activityController.getAllAudioOfUser);
// router.get('/:slug/companies', );
// router.get('/:slug/album', );
// router.get('/:slug/album/:id', );
// router.get('/:slug/album/profile', );
// router.get('/:slug/settings', );
// router.get('/:slug/album/profile?limit=ture', );
// router.get('/lookups', );
// /${slug}/friends?query=${searchValue}
// /${slug}/activity/bookmark
// /${slug}/friends-request
// /${slug}/friends
// /${slug}/audio
// /${slug}/video
// 
//


/**
 * Post
 */

router.post('/:slug/hobbies', AuthMiddleWare, profileController.addHobbies);
router.post('/:slug/training', AuthMiddleWare, profileController.addTaninig);
router.post('/:slug/social', AuthMiddleWare, profileController.addSocialNetwork);
router.post('/:slug/companies', AuthMiddleWare, companyController.createCompany);

// send friend request
router.post('/:slug/friends', AuthMiddleWare, friendsController.sendFriendRequest);

// accept friend request 
router.post('/:slug/friends/accept', AuthMiddleWare, friendsController.acceptFriendRequest);

// reject friend request
router.post('/:slug/friends/reject', AuthMiddleWare, friendsController.rejectFriendRequest);

// add video or audio in profile page

router.post('/:slug/video', AuthMiddleWare, activityController.AddNewVideoOrAudio);
router.post('/:slug/audio', AuthMiddleWare, activityController.AddNewVideoOrAudio);

// delete friend / unfriend
router.delete('/:slug/friends', AuthMiddleWare, friendsController.deleteFriend);

// router.post('/:slug/album', );
// router.post('/:slug/album/image', );
// router.post('/:slug/social', );
// router.post('/:user/switch', );


// router.patch('/:slug/settings', );


// put & patch
router.put('/:slug/training/:id', AuthMiddleWare, profileController.updateTaninig);
router.put('/:slug/social/:id', AuthMiddleWare, profileController.updateSocialNetwork);
// router.post('/:id', userController.add);
router.patch('/:slug/settings', AuthMiddleWare, profileController.updateProfileSettings);
router.patch('/:slug/update', AuthMiddleWare, profileController.updateProfile);

router.patch('/:slug/avatar', AuthMiddleWare, profileController.updateAvatar);
router.patch('/:slug/cover', AuthMiddleWare, profileController.updateCover);
router.post('/:slug/cover/reset', AuthMiddleWare, profileController.resetCover);

// router.delete('/:id', profileController.remove);
// delete
router.delete('/:slug/training/:id', AuthMiddleWare, profileController.deleteTaninig);
router.delete('/:slug/hobbies/:id', AuthMiddleWare, profileController.deleteHobbies);

export default router;
