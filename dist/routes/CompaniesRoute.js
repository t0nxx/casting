"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CompanyController_1 = require("../controllers/CompanyController");
const JobsController_1 = require("../controllers/JobsController");
const router = express_1.Router();
const companyController = new CompanyController_1.CompanyController();
const jobsController = new JobsController_1.JobsController();
router.get('/:slug', companyController.GetOneCompany);
router.get('/:slug/jobs', jobsController.getAllJobs);
router.post('/:slug/switch', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.status(200).send({ s: true });
}));
router.post('/:slug/jobs', jobsController.createJob);
exports.default = router;
//# sourceMappingURL=CompaniesRoute.js.map