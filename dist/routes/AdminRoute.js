"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleWare_1 = require("../middlewares/AuthMiddleWare");
const AdminLookups_1 = require("../controllers/dashboard/AdminLookups");
const AdminAddition_1 = require("../controllers/dashboard/AdminAddition");
const AuthController_1 = require("../controllers/AuthController");
const Notifications_1 = require("../controllers/api/Notifications");
const advertisements_1 = require("../controllers/dashboard/advertisements");
const companies_1 = require("../controllers/dashboard/companies");
const jobs_1 = require("../controllers/dashboard/jobs");
const newslettersmails_1 = require("../controllers/dashboard/newslettersmails");
const newsLetterIgnoredEmails_1 = require("../controllers/dashboard/newsLetterIgnoredEmails");
const router = express_1.Router();
router.use(AuthMiddleWare_1.AuthMiddleWare);
const adminLookupsController = new AdminLookups_1.AdminLookupsController();
const adminAdditionController = new AdminAddition_1.AdminAdditionController();
const notificationController = new Notifications_1.NotificationsController();
const advertisementController = new advertisements_1.AdvertisementController();
const adminCompaniesController = new companies_1.AdminCompaniesController();
const adminJobsController = new jobs_1.AdminJobsController();
const adminSendMailsController = new newslettersmails_1.AdminSendMailsController();
const ignoredEmailsFromNewsletterController = new newsLetterIgnoredEmails_1.IgnoredEmailsFromNewsletterController();
const authController = new AuthController_1.AuthController();
router.post('/login', authController.adminLogin);
router.get('/notifications', notificationController.getAllNotificationsForAdmin);
router.post('/notifications', notificationController.addNotificationsFromAdmin);
router.get('/user', adminAdditionController.getAllUsers);
router.get('/user/:id', adminAdditionController.getOneUser);
router.put('/user/:id', adminAdditionController.updateUser);
router.delete('/user/:id', adminAdditionController.deleteUser);
router.get('/company', adminCompaniesController.getAllCompanies);
router.get('/company/:id', adminCompaniesController.getOneCompanies);
router.delete('/company/:id', adminCompaniesController.deleteOneCompanies);
router.get('/jobs', adminJobsController.getAllJobs);
router.get('/jobs/:id', adminJobsController.getOneJobs);
router.delete('/jobs/:id', adminJobsController.deleteOneJobs);
router.get('/getmaildesgin', adminSendMailsController.getHtmlMailTemplate);
router.post('/savemaildesgin', adminSendMailsController.saveHtmlMailTemplate);
router.post('/sendnewslettermail', adminSendMailsController.sendNewsLetterMail);
router.get('/ignoredfrommails', ignoredEmailsFromNewsletterController.getAllIgnoredEmailsFromNewsletter);
router.post('/ignoredfrommails', ignoredEmailsFromNewsletterController.createNewIgnoredEmailsFromNewsletter);
router.get('/ignoredfrommails/:id', ignoredEmailsFromNewsletterController.getOneIgnoredEmailsFromNewsletter);
router.put('/ignoredfrommails/:id', ignoredEmailsFromNewsletterController.updateOneIgnoredEmailsFromNewsletter);
router.delete('/ignoredfrommails/:id', ignoredEmailsFromNewsletterController.deleteOneIgnoredEmailsFromNewsletter);
router.get('/advertisement', advertisementController.getAllAdvertisement);
router.post('/advertisement', advertisementController.createNewAdvertisement);
router.get('/advertisement/:id', advertisementController.getOneAdvertisement);
router.put('/advertisement/:id', advertisementController.updateOneAdvertisement);
router.delete('/advertisement/:id', advertisementController.deleteOneAdvertisement);
router.get('/reports', adminAdditionController.getActivityReports);
router.delete('/reports/:id', adminAdditionController.deleteReportedActivityFromAdmin);
router.get('/:lookupRepo', adminLookupsController.getAllTemplate);
router.get('/:lookupRepo/:id', adminLookupsController.getOneTemplate);
router.post('/:lookupRepo', adminLookupsController.createNewTemplate);
router.put('/:lookupRepo/:id', adminLookupsController.updateOneTemplate);
router.delete('/:lookupRepo/:id', adminLookupsController.deleteOneTemplate);
exports.default = router;
//# sourceMappingURL=AdminRoute.js.map