import { Router } from 'express';
import { TalentCategoriesController } from '../controllers/api/TalentCategoriesController';
import { NewsLetterController } from '../controllers/api/NewsLetterController';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const talentController = new TalentCategoriesController();
const authController = new AuthController();
const newsLetterController = new NewsLetterController();

// start talent categories
router.get('/talent-categories', talentController.getAllTalentCategories);
router.post('/new-category', talentController.createNewCategory);
// end talent categories

// start verify username , email is available
router.post('/verifyusernameemail', authController.verifyEmailAndUsernamIsAvailable);

router.post('/subscribe', newsLetterController.subscribeToNewsLetter);
// end verify username , email is available
export default router;
