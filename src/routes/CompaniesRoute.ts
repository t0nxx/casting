import { Router } from 'express';
import { companyController } from '../controllers/CompanyController';
import { jobsController } from '../controllers/JobsController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { activityController } from '../controllers/ActivityController';

const router = Router();

router.get('/:slug', AuthMiddleWare, companyController.GetOneCompany);

router.patch('/:slug', AuthMiddleWare, companyController.updateCompany);

router.patch('/:slug/removetags', AuthMiddleWare, companyController.removeTagsCompany);

router.patch('/:slug/avatar', AuthMiddleWare, companyController.updateCompanyAvatar);

router.patch('/:slug/cover', AuthMiddleWare, companyController.updateCompanyCover);

router.post('/:slug/cover/reset', AuthMiddleWare, companyController.resetCompanyCover);

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
router.get('/:slug/jobs/:jobSlug/applied', AuthMiddleWare, jobsController.getApplicants);
router.get('/:slug/jobs/:jobSlug/shortlisted', AuthMiddleWare, jobsController.getShortListed);
router.get('/:slug/jobs/:jobSlug/interview', AuthMiddleWare, jobsController.getInterviews);

router.post('/:slug/jobs', AuthMiddleWare, jobsController.createJob);

// send mails for new job , it dev onlyyyyyyyyy ----------------------------------
router.post('/:slug/jobs/testmails', AuthMiddleWare, jobsController.newJobeMailDEVELOPMENTONLY);
/////////////////////////////////////////

router.post('/:slug/jobs/:jobSlug/apply', AuthMiddleWare, jobsController.applyJob);

router.post('/:slug/jobs/:jobSlug/shortlisted', AuthMiddleWare, jobsController.addApplicantsToShortList);

router.post('/:slug/jobs/:jobSlug/un-shortlisted/:userSlug', AuthMiddleWare, jobsController.removeApplicantFromShortList);

router.post('/:slug/jobs/:jobSlug/interview/:userSlug', AuthMiddleWare, jobsController.createInterviewForapplicants);

router.patch('/:slug/jobs/:jobSlug', AuthMiddleWare, jobsController.updateJob);
router.delete('/:slug/jobs/:jobSlug', AuthMiddleWare, jobsController.deleteJob);



export default router;
