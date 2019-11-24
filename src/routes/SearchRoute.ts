import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { SearchController } from '../controllers/SearchController';

const router = Router();
const searchController = new SearchController();

router.get('/jobs', AuthMiddleWare, searchController.searchJobs);
router.get('/companies', AuthMiddleWare, searchController.searchCompaines);
router.get('/people', AuthMiddleWare, searchController.searchPeople);


export default router;
