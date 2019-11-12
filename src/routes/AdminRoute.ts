import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';
import { AdminLookupsController } from '../controllers/dashboard/AdminLookups';
import { AdminAdditionController } from '../controllers/dashboard/AdminAddition';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const adminLookupsController = new AdminLookupsController();
const adminAdditionController = new AdminAdditionController();
const authController = new AuthController();
// not add auth middle ware in dev 
router.post('/login', authController.adminLogin);

router.get('/user', adminAdditionController.getAllUsers);
router.get('/user/:id', adminAdditionController.getOneUser);
router.put('/user/:id', adminAdditionController.updateUser);
router.delete('/user/:id', adminAdditionController.deleteUser);


router.get('/:lookupRepo', adminLookupsController.getAllTemplate);
router.get('/:lookupRepo/:id', adminLookupsController.getOneTemplate);
router.post('/:lookupRepo', adminLookupsController.createNewTemplate);
router.put('/:lookupRepo/:id', adminLookupsController.updateOneTemplate);
router.delete('/:lookupRepo/:id', adminLookupsController.deleteOneTemplate);





export default router;