import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { SearchController } from '../controllers/SearchController';

const router = Router();
const searchController = new SearchController();

router.get('/jobs', AuthMiddleWare, searchController.searchJobs);
router.get('/companies', AuthMiddleWare, searchController.searchCompaines);
router.get('/profile', AuthMiddleWare, searchController.searchPeople);


router.get('/companies/followed', AuthMiddleWare, searchController.searchMYFollowedCompaines);


export default router;
