import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { Company } from '../models/newModels/company';
import { TalentCategories } from '../models/newModels/talent_categories';
import { Jobs } from '../models/newModels/jobs';
export class JobsController {

    /**
      * @Get All  Jobs of Company
      */

    async getAllJobs(request: Request, response: Response, next: NextFunction) {

        const companyRepository = getRepository(Company);
        const JobRepository = getRepository(Jobs);
        try {
            const com = await companyRepository.findOne({ slug: request.params.slug });
            if (!com) { throw new Error('company Not Found'); }

            const jobs = await JobRepository.find({ where: { company: com } });
            return response.status(200).send(jobs);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
   * @Get Company
   */
    async getOneJob(request: Request, response: Response, next: NextFunction) {

        const companyRepository = getRepository(Company);
        const JobRepository = getRepository(Jobs);
        try {
            const job = await JobRepository.findOne({ slug: request.params.slug });
            if (!job) { throw new Error('job Not Found'); }
            return response.status(200).send({ success: true, ...job });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
   * @Create Job
   */
    async createJob(request: Request, response: Response, next: NextFunction) {

        const companyRepository = getRepository(Company);
        const JobRepository = getRepository(Jobs);
        const talentCategoryRepository = getRepository(TalentCategories);
        try {
            const company = await companyRepository.findOne({ slug: request.params.slug });
            if (!company) { throw new Error('company Not Found'); }

            const newJob = new Jobs();
            Object.assign(newJob, request.body);

            // cause front end send null !!!!
            

            if (request.body.category) {
                const category = await talentCategoryRepository.findByIds(request.body.category);
                newJob.category = category;
            }
            newJob.company = company;
            newJob.slug = newJob.title + '-' + randomString.generate({ length: 5 });
            const save = await JobRepository.save(newJob);
            return response.status(200).send({ success: true, slug: save.slug });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
}
