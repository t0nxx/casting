import { Router } from 'express';
import { TalentCategoriesController } from '../controllers/api/TalentCategoriesController';
import { NewsLetterController } from '../controllers/api/NewsLetterController';
import { NotificationsController } from '../controllers/api/Notifications';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { RandomJobsAndUsersController } from '../controllers/api/RandomJobAndUser';

const router = Router();
const talentController = new TalentCategoriesController();
const authController = new AuthController();
const newsLetterController = new NewsLetterController();
const notificationsController = new NotificationsController();
const randomJobsAndUsersController = new RandomJobsAndUsersController();

// start talent categories
router.get('/talent-categories', talentController.getAllTalentCategories);

router.post('/new-category', talentController.createNewCategory);
// end talent categories

// notifiactions
router.get('/notification', AuthMiddleWare, notificationsController.getAllNotifications);
router.get('/notification/new', AuthMiddleWare, notificationsController.getCountOfNewAndNotRead);
router.post('/notification/:id/read', AuthMiddleWare, notificationsController.makeNotificationRead);

router.get('/random/jobs', randomJobsAndUsersController.getRandomJobs);
router.get('/random/users',randomJobsAndUsersController.getRandomUsers);

// start verify username , email is available
router.post('/verifyusernameemail', authController.verifyEmailAndUsernamIsAvailable);

router.post('/subscribe', newsLetterController.subscribeToNewsLetter);

router.post('/invite', newsLetterController.inviteToCasting);
// end verify username , email is available
export default router;
