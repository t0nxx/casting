import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { JobsController } from '../controllers/JobsController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { ActivityController } from '../controllers/ActivityController';

const router = Router();
const companyController = new CompanyController();
const jobsController = new JobsController();
const activityController = new ActivityController();

router.get('/:slug', AuthMiddleWare, companyController.GetOneCompany);

router.patch('/:slug', AuthMiddleWare, companyController.updateCompany);

router.patch('/:slug/removetags', AuthMiddleWare, companyController.removeTagsCompany);

router.patch('/:slug/avatar', AuthMiddleWare, companyController.updateCompanyAvatar);

router.patch('/:slug/cover', AuthMiddleWare, companyController.updateCompanyCover);

router.post('/:slug/follow', AuthMiddleWare, companyController.followCompany);

router.post('/:slug/un-follow', AuthMiddleWare, companyController.unFollowCompany);

router.delete('/:slug', AuthMiddleWare, companyController.deleteCompany);

router.post('/:slug/switch', AuthMiddleWare, companyController.switchToCompany);


// activity

router.get('/:slug/activity', AuthMiddleWare, activityController.getActivityOfCompany);
router.post('/:slug/activity', AuthMiddleWare, activityController.AddNewActivityToCompany);

// jobs
router.get('/:slug/jobs', AuthMiddleWare, jobsController.getAllJobs);
router.get('/:slug/jobs/:jobSlug', AuthMiddleWare, jobsController.getOneJob);
router.get('/:slug/jobs/:jobSlug/info', jobsController.getOneJobForNotLOgin);
router.post('/:slug/jobs/:jobSlug/apply', AuthMiddleWare, jobsController.applyJob);

router.get('/:slug/jobs/:jobSlug/applied', AuthMiddleWare, jobsController.getApplicants);

router.patch('/:slug/jobs/:jobSlug', AuthMiddleWare, jobsController.updateJob);
router.delete('/:slug/jobs/:jobSlug', AuthMiddleWare, jobsController.deleteJob);

// create new job
router.post('/:slug/jobs', AuthMiddleWare, jobsController.createJob);

export default router;
