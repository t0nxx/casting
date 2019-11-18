import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { JobsController } from '../controllers/JobsController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';

const router = Router();
const companyController = new CompanyController();
const jobsController = new JobsController();

router.get('/:slug', AuthMiddleWare, companyController.GetOneCompany);

router.patch('/:slug', AuthMiddleWare, companyController.updateCompany);

router.patch('/:slug/removetags', AuthMiddleWare, companyController.removeTagsCompany);

router.patch('/:slug/avatar', AuthMiddleWare, companyController.updateCompanyAvatar);

router.patch('/:slug/cover', AuthMiddleWare, companyController.updateCompanyCover);

router.post('/:slug/follow', AuthMiddleWare, companyController.followCompany);

router.post('/:slug/un-follow', AuthMiddleWare, companyController.unFollowCompany);

router.delete('/:slug', AuthMiddleWare, companyController.deleteCompany);

router.post('/:slug/switch', AuthMiddleWare, companyController.switchToCompany);

router.get('/:slug/jobs', AuthMiddleWare, jobsController.getAllJobs);

// create new job
router.post('/:slug/jobs', AuthMiddleWare, jobsController.createJob);

export default router;
