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
const typeorm_1 = require("typeorm");
const randomString = require("randomstring");
const company_1 = require("../models/newModels/company");
const talent_categories_1 = require("../models/newModels/talent_categories");
const jobs_1 = require("../models/newModels/jobs");
class JobsController {
    getAllJobs(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            try {
                const com = yield companyRepository.findOne({ slug: request.params.slug });
                if (!com) {
                    throw new Error('company Not Found');
                }
                const jobs = yield JobRepository.find({ where: { company: com } });
                return response.status(200).send(jobs);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getOneJob(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            try {
                const job = yield JobRepository.findOne({ slug: request.params.slug });
                if (!job) {
                    throw new Error('job Not Found');
                }
                return response.status(200).send(Object.assign({ success: true }, job));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    createJob(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug });
                if (!company) {
                    throw new Error('company Not Found');
                }
                const newJob = new jobs_1.Jobs();
                Object.assign(newJob, request.body);
                if (request.body.category) {
                    const category = yield talentCategoryRepository.findByIds(request.body.category);
                    newJob.category = category;
                }
                newJob.company = company;
                newJob.slug = newJob.title + '-' + randomString.generate({ length: 5 });
                const save = yield JobRepository.save(newJob);
                return response.status(200).send({ success: true, slug: save.slug });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.JobsController = JobsController;
//# sourceMappingURL=JobsController.js.map