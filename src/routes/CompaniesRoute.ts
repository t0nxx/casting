import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { JobsController } from '../controllers/JobsController';
import { AuthMiddleWare } from '../middlewares/AuthMiddleWare';

const router = Router();
const companyController = new CompanyController();
const jobsController = new JobsController();

router.get('/:slug', companyController.GetOneCompany);

router.get('/:slug/jobs', jobsController.getAllJobs)

router.post('/:slug/switch', async (req, res) => {
    res.status(200).send({ s: true })
});

// create new job 
router.post('/:slug/jobs', jobsController.createJob)
export default router;