import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { Company } from '../models/newModels/company';
import { TalentCategories } from '../models/newModels/talent_categories';
import { Jobs } from '../models/newModels/jobs';
import { ApplyPagination } from '../helpers/pagination';
import { Profile } from '../models/newModels/users_profile';
import { User } from '../models/newModels/auth_user';
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

            const q = JobRepository.createQueryBuilder('j')
                .where(`j.companyId = ${com.id}`)
                .orderBy('j.id', 'DESC');
            if (request.query.search) {
                q.andWhere(`j.title like '%${request.query.search}%' `);
                q.andWhere(`j.description like '%${request.query.search}%' `);
            }
            const jobs = await ApplyPagination(request, response, q, false);
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
        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        const JobRepository = getRepository(Jobs);
        try {
            let is_admin = false;
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['companies'] });
            const job = await JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category', 'company'] });
            if (!job) { throw new Error('job Not Found'); }
            if (profile && profile.companies.length > 0 && profile.companies[0].slug === job.company.slug) {
                is_admin = true;
            }

            let job_category = [];
            job_category = job.category;
            delete job.category;
            delete job.company;
            return response.status(200).send({ ...job, job_category, is_admin });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
   * @Get Company
   */
    async getOneJobForNotLOgin(request: Request, response: Response, next: NextFunction) {
        const companyRepository = getRepository(Company);
        const JobRepository = getRepository(Jobs);
        try {
            const job = await JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category', 'company'] });
            if (!job) { throw new Error('job Not Found'); }
            let job_category = [];
            job_category = job.category;
            delete job.category;
            delete job.company;
            return response.status(200).send({ ...job, job_category, is_admin: false });
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

    /**
  * @Update Job
  */
    async updateJob(request: Request, response: Response, next: NextFunction) {
        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        const talentCategoryRepository = getRepository(TalentCategories);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['companies'] });
            const job = await JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category', 'company'] });
            if (!job) { throw new Error('job Not Found'); }
            if (profile && profile.companies.length > 0 && profile.companies[0].slug === job.company.slug) {
                let newData = Object.keys(request.body).length;
                if (newData < 1) { throw new Error('no data provided to update'); }

                if (request.body.category) {
                    const category = await talentCategoryRepository.findByIds(request.body.category);
                    job.category = [...job.category, ...category];
                    await JobRepository.save(job);
                    delete request.body.category;
                }
                let newDataWitoutTags = Object.keys(request.body).length;
                if (newDataWitoutTags > 1) {
                    await JobRepository.update({ slug: request.params.jobSlug }, request.body);
                }

                const jobAfterUpdate = await JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category'] });
                delete jobAfterUpdate.company;
                return response.status(200).send({ ...jobAfterUpdate, is_admin: true });

            } else {
                throw new Error('You are not allowed to edit this job')
            }

        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
  * @Delete Job
  */
    async deleteJob(request: Request, response: Response, next: NextFunction) {
        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        const talentCategoryRepository = getRepository(TalentCategories);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['companies'] });
            const job = await JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category', 'company'] });
            if (!job) { throw new Error('job Not Found'); }
            if (profile && profile.companies.length > 0 && profile.companies[0].slug === job.company.slug) {
                await JobRepository.remove(job)
                return response.status(200).send({ success: true });

            } else {
                throw new Error('You are not allowed to remove this job');
            }

        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
   * @Apply job
   */
    async applyJob(request: Request, response: Response, next: NextFunction) {
        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const job = await JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['applicants'] });
            if (!job) { throw new Error('job Not Found'); }

            const tempArr = job.applicants.map(e => e.id);
            const isAlreadyApplied = tempArr.includes(profile.id);

            if (isAlreadyApplied) {
                throw new Error('You are already applied to this job');
            }

            job.applicants = [...job.applicants, profile];

            await JobRepository.save(job);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async getApplicants(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const userRepository = getRepository(User);
        const JobRepository = getRepository(Jobs);
        try {
            const job = await JobRepository.findOne({ slug: request.params.jobSlug });

            const applied = await profileRepository.createQueryBuilder('p')
                // .innerJoin('p.user', 'user')
                .innerJoinAndSelect('p.applied_jobs', 'applied_jobs')
                .where('p.applied_jobs = 10')
                // .where(`p.applied_jobs = 1`)
                .getMany();
            // const q = JobRepository.createQueryBuilder('j')
            //     .leftJoinAndSelect('j.applicants','applicants')
            //     // .innerJoinAndMapOne('j.user', User, 'user', 'user.id = j.applicants.userId');

            // const people = await ApplyPagination(request, response, q, false);
            // people.results = people.results.map(e => {
            //     const { first_name, last_name, email, username } = e['user'];
            //     const auth_user = {
            //         first_name, last_name, email, username, pk: e.id,
            //     };
            //     delete e['user'];
            //     return { ...e, auth_user }
            // })

            return response.status(200).send(applied);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
}
