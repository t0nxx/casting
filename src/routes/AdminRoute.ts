import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { AdminLookupsController } from '../controllers/dashboard/AdminLookups';
import { AdminAdditionController } from '../controllers/dashboard/AdminAddition';
import { AuthController } from '../controllers/AuthController';
import { NotificationsController } from '../controllers/api/Notifications';
import { AdvertisementController } from '../controllers/dashboard/advertisements';
import { AdminCompaniesController } from '../controllers/dashboard/companies';
import { AdminJobsController } from '../controllers/dashboard/jobs';
import { AdminSendMailsController } from '../controllers/dashboard/newslettersmails';
import { IgnoredEmailsFromNewsletterController } from '../controllers/dashboard/newsLetterIgnoredEmails';

const router = Router();
// router.use(AuthMiddleWare);
const adminLookupsController = new AdminLookupsController();
const adminAdditionController = new AdminAdditionController();
const notificationController = new NotificationsController();
const advertisementController = new AdvertisementController();
const adminCompaniesController = new AdminCompaniesController();
const adminJobsController = new AdminJobsController();
const adminSendMailsController = new AdminSendMailsController();
const ignoredEmailsFromNewsletterController = new IgnoredEmailsFromNewsletterController()
const authController = new AuthController();
// not add auth middle ware in dev 
router.post('/login', AuthMiddleWare, authController.adminLogin);
router.get('/notifications', AuthMiddleWare, notificationController.getAllNotificationsForAdmin);
router.post('/notifications', AuthMiddleWare, notificationController.addNotificationsFromAdmin);

router.get('/user', AuthMiddleWare, adminAdditionController.getAllUsers);
router.get('/user/:id', AuthMiddleWare, adminAdditionController.getOneUser);
router.put('/user/:id', AuthMiddleWare, adminAdditionController.updateUser);
router.delete('/user/:id', AuthMiddleWare, adminAdditionController.deleteUser);


router.get('/company', AuthMiddleWare, adminCompaniesController.getAllCompanies);
router.get('/company/:id', AuthMiddleWare, adminCompaniesController.getOneCompanies);
router.delete('/company/:id', AuthMiddleWare, adminCompaniesController.deleteOneCompanies);

router.get('/jobs', AuthMiddleWare, adminJobsController.getAllJobs);
router.get('/jobs/:id', AuthMiddleWare, adminJobsController.getOneJobs);
router.delete('/jobs/:id', AuthMiddleWare, adminJobsController.deleteOneJobs);


router.get('/getmaildesgin', AuthMiddleWare, adminSendMailsController.getHtmlMailTemplate);
router.post('/savemaildesgin', AuthMiddleWare, adminSendMailsController.saveHtmlMailTemplate);
router.post('/sendnewslettermail', AuthMiddleWare, adminSendMailsController.sendNewsLetterMail);


router.get('/ignoredfrommails', AuthMiddleWare, ignoredEmailsFromNewsletterController.getAllIgnoredEmailsFromNewsletter);
router.post('/ignoredfrommails', AuthMiddleWare, ignoredEmailsFromNewsletterController.createNewIgnoredEmailsFromNewsletter);
router.get('/ignoredfrommails/:id', AuthMiddleWare, ignoredEmailsFromNewsletterController.getOneIgnoredEmailsFromNewsletter);
router.put('/ignoredfrommails/:id', AuthMiddleWare, ignoredEmailsFromNewsletterController.updateOneIgnoredEmailsFromNewsletter);
router.delete('/ignoredfrommails/:id', AuthMiddleWare, ignoredEmailsFromNewsletterController.deleteOneIgnoredEmailsFromNewsletter);


router.get('/advertisement', AuthMiddleWare, advertisementController.getAllAdvertisement);
router.post('/advertisement', AuthMiddleWare, advertisementController.createNewAdvertisement);
router.get('/advertisement/:id', AuthMiddleWare, advertisementController.getOneAdvertisement);
router.put('/advertisement/:id', AuthMiddleWare, advertisementController.updateOneAdvertisement);
router.delete('/advertisement/:id', AuthMiddleWare, advertisementController.deleteOneAdvertisement);


router.get('/reports', AuthMiddleWare, adminAdditionController.getActivityReports);
router.delete('/reports/:id', AuthMiddleWare, adminAdditionController.deleteReportedActivityFromAdmin);



router.get('/:lookupRepo', AuthMiddleWare, adminLookupsController.getAllTemplate);
router.get('/:lookupRepo/:id', AuthMiddleWare, adminLookupsController.getOneTemplate);
router.post('/:lookupRepo', AuthMiddleWare, adminLookupsController.createNewTemplate);
router.put('/:lookupRepo/:id', AuthMiddleWare, adminLookupsController.updateOneTemplate);
router.delete('/:lookupRepo/:id', AuthMiddleWare, adminLookupsController.deleteOneTemplate);





export default router;
