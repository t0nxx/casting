import { Router } from 'express';
import { talentCategoriesController } from '../controllers/api/TalentCategoriesController';
import { newsLetterController } from '../controllers/api/NewsLetterController';
import { notificationsController } from '../controllers/api/Notifications';
import { authController } from '../controllers/AuthController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { randomJobsAndUsersController } from '../controllers/api/RandomJobAndUser';
import { searchController } from '../controllers/SearchController';

const router = Router();

// start talent categories
router.get('/talent-categories', talentCategoriesController.getAllTalentCategories);

router.post('/new-category', talentCategoriesController.createNewCategory);
// end talent categories

// notifiactions
router.get('/notification', AuthMiddleWare, notificationsController.getAllNotifications);
router.get('/notification/new', AuthMiddleWare, notificationsController.getCountOfNewAndNotRead);
router.post('/notification/readall', AuthMiddleWare, notificationsController.makeAllNotificationsRead);
router.post('/notification/:id/read', AuthMiddleWare, notificationsController.makeNotificationRead);

router.get('/random/jobs', randomJobsAndUsersController.getRandomJobs);
router.get('/random/users', randomJobsAndUsersController.getRandomUsers);

router.get('/landing/search', searchController.searchPeopleLandingPage);

// start verify username , email is available
router.post('/verifyusernameemail', authController.verifyEmailAndUsernamIsAvailable);

router.post('/subscribe', newsLetterController.subscribeToNewsLetter);

router.post('/invite', newsLetterController.inviteToCasting);
// end verify username , email is available
export default router;
