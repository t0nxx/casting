import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { searchController } from '../controllers/SearchController';

const router = Router();

router.get('/jobs', AuthMiddleWare, searchController.searchJobs);
router.get('/jobs/suitsme', AuthMiddleWare, searchController.getSuitesMeJobs);
router.get('/jobs/applied', AuthMiddleWare, searchController.getMyAppliedJobs);
router.get('/companies', AuthMiddleWare, searchController.searchCompaines);
router.get('/profile', AuthMiddleWare, searchController.searchPeople);


router.get('/companies/followed', AuthMiddleWare, searchController.searchMYFollowedCompaines);


export default router;
