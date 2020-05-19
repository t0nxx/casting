import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { AdminLookupsController } from '../controllers/dashboard/AdminLookups';
import { AdminAdditionController } from '../controllers/dashboard/AdminAddition';
import { AuthController } from '../controllers/AuthController';
import { NotificationsController } from '../controllers/api/Notifications';
import { AdvertisementController } from '../controllers/dashboard/advertisements';

const router = Router();
router.use(AuthMiddleWare);
const adminLookupsController = new AdminLookupsController();
const adminAdditionController = new AdminAdditionController();
const notificationController = new NotificationsController();
const advertisementController = new AdvertisementController()
const authController = new AuthController();
// not add auth middle ware in dev 
router.post('/login', authController.adminLogin);
router.get('/notifications', notificationController.getAllNotificationsForAdmin);
router.post('/notifications', notificationController.addNotificationsFromAdmin);

router.get('/user', adminAdditionController.getAllUsers);
router.get('/user/:id', adminAdditionController.getOneUser);
router.put('/user/:id', adminAdditionController.updateUser);
router.delete('/user/:id', adminAdditionController.deleteUser);



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





export default router;
