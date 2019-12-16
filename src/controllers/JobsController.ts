import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { Company } from '../models/newModels/company';
import { TalentCategories } from '../models/newModels/talent_categories';
import { Jobs } from '../models/newModels/jobs';
import { ApplyPagination } from '../helpers/pagination';
import { Profile } from '../models/newModels/users_profile';
import { User } from '../models/newModels/auth_user';
import { JobInterview } from '../models/newModels/jobs_interview';
import { JobApplicants } from '../models/newModels/jobs_applicants';
import { JobShortlist } from '../models/newModels/jobs_shortlisted';
import { transformAndValidate } from 'class-transformer-validator';
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
        const JobApplicantRepository = getRepository(JobApplicants);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const job = await JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['applicants'] });
            if (!job) { throw new Error('job Not Found'); }

            const isAlreadyApplied = await JobApplicantRepository.findOne({ job, profile });

            if (isAlreadyApplied) {
                throw new Error('You are already applied to this job');
            }

            const newApplicant = new JobApplicants();
            newApplicant.job = job;
            newApplicant.profile = profile;

            await JobApplicantRepository.save(newApplicant);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async getApplicants(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        const JobApplicantRepository = getRepository(JobApplicants);
        try {
            const job = await JobRepository.findOne({ slug: request.params.jobSlug });
            if (!job) { throw new Error('job Not Found'); }

            const q = JobApplicantRepository.createQueryBuilder('a')
                .innerJoin('a.profile', 'profile')
                .select(['a.id', 'profile.id'])
                .orderBy('a.id', 'DESC');

            const people = await ApplyPagination(request, response, q, false);
            people.results = people.results.map(e => e.profile.id);

            const users = await profileRepository.findByIds(people.results, {
                relations: ['user']
            });

            people.results = users.map(e => {
                const { first_name, last_name, email } = e.user;
                const auth_user = { first_name, last_name, email };
                delete e['user'];
                return { ...e, auth_user }
            });

            return response.status(200).send(people);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async getShortListed(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        const JobShortListedRepository = getRepository(JobShortlist);
        try {
            const job = await JobRepository.findOne({ slug: request.params.jobSlug });
            if (!job) { throw new Error('job Not Found'); }

            const q = JobShortListedRepository.createQueryBuilder('a')
                .innerJoin('a.profile', 'profile')
                .select(['a.id', 'profile.id'])
                .orderBy('a.id', 'DESC');

            const people = await ApplyPagination(request, response, q, false);
            people.results = people.results.map(e => e.profile.id);

            const users = await profileRepository.findByIds(people.results, {
                relations: ['user']
            });

            people.results = users.map(e => {
                const { first_name, last_name, email } = e.user;
                const auth_user = { first_name, last_name, email };
                delete e['user'];
                return { ...e, auth_user }
            });

            return response.status(200).send(people);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async getInterviews(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        const JobInterviewRepository = getRepository(JobInterview);
        try {
            const job = await JobRepository.findOne({ slug: request.params.jobSlug });
            if (!job) { throw new Error('job Not Found'); }

            const q = JobInterviewRepository.createQueryBuilder('a')
                .innerJoin('a.profile', 'profile')
                .innerJoinAndMapOne('a.user', User, 'user', 'user.id = profile.userId')
                .orderBy('a.id', 'DESC');

            const people = await ApplyPagination(request, response, q, false);
            people.results = people.results.map(e => {
                const { first_name, last_name, email } = e.user;
                const auth_user = { first_name, last_name, email };
                delete e.user;
                return { ...e, auth_user };
            });

            return response.status(200).send(people);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async addApplicantsToShortList(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        const JobshortlistRepository = getRepository(JobShortlist);
        try {
            const job = await JobRepository.findOne({ slug: request.params.jobSlug });
            if (!job) { throw new Error('job Not Found'); }

            const people = await profileRepository.findByIds(request.body.users);

            const shortlistedUsers = await JobshortlistRepository.createQueryBuilder('s')
                .innerJoin('s.profile', 'profile')
                .select(['s.id', 'profile.id'])
                .where(`s.jobId = ${job.id}`)
                .getMany();

            const shortlistedUsersFormated = shortlistedUsers.map(e => e.profile.id);


            people.forEach(async p => {
                if (!shortlistedUsersFormated.includes(p.id)) {
                    const newShorlisted = new JobShortlist();
                    newShorlisted.job = job;
                    newShorlisted.profile = p;
                    await JobshortlistRepository.save(newShorlisted);
                }

            });

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async removeApplicantFromShortList(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        const JobshortlistRepository = getRepository(JobShortlist);
        try {
            const job = await JobRepository.findOne({ slug: request.params.jobSlug });
            if (!job) { throw new Error('job Not Found'); }

            const profile = await profileRepository.findOne({ slug: request.params.userSlug });

            const findOne = await JobshortlistRepository.findOne({ job, profile });
            if (!findOne) { throw new Error('user is already Not shortlisted '); }

            await JobshortlistRepository.remove(findOne);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async createInterviewForapplicants(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        const JobInterviewRepository = getRepository(JobInterview);
        const JobshortlistRepository = getRepository(JobShortlist);
        try {
            const job = await JobRepository.findOne({ slug: request.params.jobSlug },
                {
                    relations: ['interviews'],
                });
            if (!job) { throw new Error('job Not Found'); }

            const profile = await profileRepository.findOne({ slug: request.params.userSlug });

            const isAlreadyHaveInterview = await JobInterviewRepository.findOne({
                where: { job, profile }
            });

            if (isAlreadyHaveInterview) {
                throw new Error('user already have an interview for this job');
            }
            const interview = new JobInterview();

            const validateBody = await transformAndValidate(JobInterview, request.body);

            Object.assign(interview, validateBody);

            interview.job = job;
            interview.profile = profile;

            await JobInterviewRepository.save(interview);
            // remove from shortlist after create interview

            const findOne = await JobshortlistRepository.findOne({ job, profile });
            if (!findOne) { throw new Error('user is already Not shortlisted '); }

            await JobshortlistRepository.remove(findOne);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
}
