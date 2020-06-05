"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const randomString = require("randomstring");
const company_1 = require("../models/company");
const talent_categories_1 = require("../models/talent_categories");
const jobs_1 = require("../models/jobs");
const pagination_1 = require("../helpers/pagination");
const users_profile_1 = require("../models/users_profile");
const auth_user_1 = require("../models/auth_user");
const jobs_interview_1 = require("../models/jobs_interview");
const jobs_applicants_1 = require("../models/jobs_applicants");
const jobs_shortlisted_1 = require("../models/jobs_shortlisted");
const class_transformer_validator_1 = require("class-transformer-validator");
const main_1 = require("../main");
const SendNotification_1 = require("../jobs/SendNotification");
const sendMail_1 = require("../helpers/sendMail");
const moment = require("moment-timezone");
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
                const q = JobRepository.createQueryBuilder('j')
                    .where(`j.companyId = ${com.id}`)
                    .orderBy('j.id', 'DESC');
                if (request.query.search) {
                    q.andWhere(`j.title like '%${request.query.search}%' `);
                    q.andWhere(`j.description like '%${request.query.search}%' `);
                }
                const jobs = yield pagination_1.ApplyPagination(request, response, q, false);
                return response.status(200).send(jobs);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getOneJob(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            try {
                let is_admin = false;
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['companies'] });
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category', 'company'] });
                if (!job) {
                    throw new Error('job Not Found');
                }
                if (profile && profile.companies.length > 0 && profile.companies[0].slug === job.company.slug) {
                    is_admin = true;
                }
                let job_category = [];
                job_category = job.category;
                delete job.category;
                delete job.company;
                return response.status(200).send(Object.assign(Object.assign({}, job), { job_category, is_admin }));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getOneJobForNotLOgin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            try {
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category', 'company'] });
                if (!job) {
                    throw new Error('job Not Found');
                }
                let job_category = [];
                job_category = job.category;
                delete job.category;
                delete job.company;
                return response.status(200).send(Object.assign(Object.assign({}, job), { job_category, is_admin: false }));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    createJob(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const company = yield companyRepository.createQueryBuilder('q')
                    .leftJoin('q.followers', 'followers')
                    .where(`q.slug like '${request.params.slug}'`)
                    .addSelect(['followers.id'])
                    .getOne();
                if (!company) {
                    throw new Error('company Not Found');
                }
                console.log(company);
                const newJob = new jobs_1.Jobs();
                Object.assign(newJob, request.body);
                if (request.body.category) {
                    const category = yield talentCategoryRepository.findByIds(request.body.category);
                    newJob.category = category;
                }
                newJob.company = company;
                newJob.slug = newJob.title + '-' + randomString.generate({ length: 5 });
                const save = yield JobRepository.save(newJob);
                company.followers.map((e) => __awaiter(this, void 0, void 0, function* () {
                    const notiToQueu = {
                        actor_first_name: company.name,
                        actor_avatar: company.avatar,
                        type: SendNotification_1.NotificationTypeEnum.newJobFromFollowedCompany,
                        target_slug: save.slug,
                        target_company: company.slug,
                        recipient: e.id,
                    };
                    yield main_1.notificationQueue.add(notiToQueu);
                }));
                return response.status(200).send({ success: true, slug: save.slug });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    updateJob(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['companies'] });
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category', 'company'] });
                if (!job) {
                    throw new Error('job Not Found');
                }
                if (profile && profile.companies.length > 0 && profile.companies[0].slug === job.company.slug) {
                    let newData = Object.keys(request.body).length;
                    if (newData < 1) {
                        throw new Error('no data provided to update');
                    }
                    if (request.body.category) {
                        const category = yield talentCategoryRepository.findByIds(request.body.category);
                        job.category = [...job.category, ...category];
                        yield JobRepository.save(job);
                        delete request.body.category;
                    }
                    let newDataWitoutTags = Object.keys(request.body).length;
                    if (newDataWitoutTags > 1) {
                        yield JobRepository.update({ slug: request.params.jobSlug }, request.body);
                    }
                    const jobAfterUpdate = yield JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category'] });
                    delete jobAfterUpdate.company;
                    return response.status(200).send(Object.assign(Object.assign({}, jobAfterUpdate), { is_admin: true }));
                }
                else {
                    throw new Error('You are not allowed to edit this job');
                }
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    deleteJob(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['companies'] });
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['category', 'company'] });
                if (!job) {
                    throw new Error('job Not Found');
                }
                if (profile && profile.companies.length > 0 && profile.companies[0].slug === job.company.slug) {
                    yield JobRepository.remove(job);
                    return response.status(200).send({ success: true });
                }
                else {
                    throw new Error('You are not allowed to remove this job');
                }
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    applyJob(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const CompanyRepository = typeorm_1.getRepository(company_1.Company);
            const JobApplicantRepository = typeorm_1.getRepository(jobs_applicants_1.JobApplicants);
            const JobShortListedRepository = typeorm_1.getRepository(jobs_shortlisted_1.JobShortlist);
            const JobInterviewRepository = typeorm_1.getRepository(jobs_interview_1.JobInterview);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug }, { relations: ['applicants', 'company'] });
                if (!job) {
                    throw new Error('job Not Found');
                }
                const companyAdmin = yield CompanyRepository.findOne({ id: job.company.id }, { relations: ['profile'] });
                const isAlreadyApplied = yield JobApplicantRepository.findOne({ job, profile });
                const isAlreadyShortlisted = yield JobShortListedRepository.findOne({ job, profile });
                const isAlreadyHaveAnInterview = yield JobInterviewRepository.findOne({ job, profile });
                if (isAlreadyApplied) {
                    throw new Error('You are already applied to this job before');
                }
                if (isAlreadyShortlisted) {
                    throw new Error('You are already shortlisted to this job before');
                }
                if (isAlreadyHaveAnInterview) {
                    throw new Error('You are already have interview to this job before');
                }
                const newApplicant = new jobs_applicants_1.JobApplicants();
                newApplicant.job = job;
                newApplicant.profile = profile;
                yield JobApplicantRepository.save(newApplicant);
                const notiToQueu = {
                    actor_first_name: request['user'].first_name,
                    actor_last_name: request['user'].last_name,
                    actor_avatar: profile.avatar,
                    type: SendNotification_1.NotificationTypeEnum.newAapplicantAdmin,
                    target_slug: job.slug,
                    target_company: job.company.slug,
                    recipient: companyAdmin.profile.id,
                };
                yield main_1.notificationQueue.add(notiToQueu);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getApplicants(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const JobApplicantRepository = typeorm_1.getRepository(jobs_applicants_1.JobApplicants);
            try {
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug });
                if (!job) {
                    throw new Error('job Not Found');
                }
                const q = JobApplicantRepository.createQueryBuilder('a')
                    .innerJoin('a.profile', 'profile')
                    .select(['a.id', 'profile.id'])
                    .where(`a.job.id = ${job.id}`)
                    .orderBy('a.id', 'DESC');
                const people = yield pagination_1.ApplyPagination(request, response, q, false);
                people.results = people.results.map(e => e.profile.id);
                const users = yield profileRepository.findByIds(people.results, {
                    relations: ['user']
                });
                people.results = users.map(e => {
                    const { first_name, last_name, email } = e.user;
                    const auth_user = { first_name, last_name, email };
                    delete e['user'];
                    return Object.assign(Object.assign({}, e), { auth_user });
                });
                return response.status(200).send(people);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getShortListed(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const JobShortListedRepository = typeorm_1.getRepository(jobs_shortlisted_1.JobShortlist);
            try {
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug });
                if (!job) {
                    throw new Error('job Not Found');
                }
                const q = JobShortListedRepository.createQueryBuilder('a')
                    .innerJoin('a.profile', 'profile')
                    .select(['a.id', 'profile.id'])
                    .where(`a.job.id = ${job.id}`)
                    .orderBy('a.id', 'DESC');
                const people = yield pagination_1.ApplyPagination(request, response, q, false);
                people.results = people.results.map(e => e.profile.id);
                const users = yield profileRepository.findByIds(people.results, {
                    relations: ['user']
                });
                people.results = users.map(e => {
                    const { first_name, last_name, email } = e.user;
                    const auth_user = { first_name, last_name, email };
                    delete e['user'];
                    return Object.assign(Object.assign({}, e), { auth_user });
                });
                return response.status(200).send(people);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getInterviews(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const JobInterviewRepository = typeorm_1.getRepository(jobs_interview_1.JobInterview);
            try {
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug });
                if (!job) {
                    throw new Error('job Not Found');
                }
                const q = JobInterviewRepository.createQueryBuilder('a')
                    .innerJoin('a.profile', 'profile')
                    .innerJoinAndMapOne('a.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`a.jobId = ${job.id}`)
                    .orderBy('a.id', 'DESC');
                const people = yield pagination_1.ApplyPagination(request, response, q, false);
                people.results = people.results.map(e => {
                    const { first_name, last_name, email } = e.user;
                    const auth_user = { first_name, last_name, email };
                    delete e.user;
                    return Object.assign(Object.assign({}, e), { auth_user });
                });
                return response.status(200).send(people);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    addApplicantsToShortList(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const JobshortlistRepository = typeorm_1.getRepository(jobs_shortlisted_1.JobShortlist);
            const JobApplicantRepository = typeorm_1.getRepository(jobs_applicants_1.JobApplicants);
            try {
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug });
                if (!job) {
                    throw new Error('job Not Found');
                }
                const people = yield profileRepository.findByIds(request.body.users);
                const shortlistedUsers = yield JobshortlistRepository.createQueryBuilder('s')
                    .innerJoin('s.profile', 'profile')
                    .select(['s.id', 'profile.id'])
                    .where(`s.jobId = ${job.id}`)
                    .getMany();
                const shortlistedUsersFormated = shortlistedUsers.map(e => e.profile.id);
                people.forEach((p) => __awaiter(this, void 0, void 0, function* () {
                    if (!shortlistedUsersFormated.includes(p.id)) {
                        const newShorlisted = new jobs_shortlisted_1.JobShortlist();
                        newShorlisted.job = job;
                        newShorlisted.profile = p;
                        yield JobshortlistRepository.save(newShorlisted);
                        const isAlreadyApplied = yield JobApplicantRepository.findOne({ job, profile: p });
                        if (isAlreadyApplied) {
                            yield JobApplicantRepository.remove(isAlreadyApplied);
                        }
                    }
                }));
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    removeApplicantFromShortList(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const JobshortlistRepository = typeorm_1.getRepository(jobs_shortlisted_1.JobShortlist);
            try {
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug });
                if (!job) {
                    throw new Error('job Not Found');
                }
                const profile = yield profileRepository.findOne({ slug: request.params.userSlug });
                const findOne = yield JobshortlistRepository.findOne({ job, profile });
                if (!findOne) {
                    throw new Error('user is already Not shortlisted ');
                }
                yield JobshortlistRepository.remove(findOne);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    createInterviewForapplicants(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            const JobInterviewRepository = typeorm_1.getRepository(jobs_interview_1.JobInterview);
            const JobshortlistRepository = typeorm_1.getRepository(jobs_shortlisted_1.JobShortlist);
            try {
                const job = yield JobRepository.findOne({ slug: request.params.jobSlug }, {
                    relations: ['interviews', 'company'],
                });
                if (!job) {
                    throw new Error('job Not Found');
                }
                const profile = yield profileRepository.findOne({ slug: request.params.userSlug }, { relations: ['user'] });
                const isAlreadyHaveInterview = yield JobInterviewRepository.findOne({
                    where: { job, profile }
                });
                if (isAlreadyHaveInterview) {
                    throw new Error('user already have an interview for this job');
                }
                const interview = new jobs_interview_1.JobInterview();
                const validateBody = yield class_transformer_validator_1.transformAndValidate(jobs_interview_1.JobInterview, request.body);
                Object.assign(interview, validateBody);
                interview.job = job;
                interview.profile = profile;
                const saveInterview = yield JobInterviewRepository.save(interview);
                const findOne = yield JobshortlistRepository.findOne({ job, profile });
                if (!findOne) {
                    throw new Error('user is already Not shortlisted ');
                }
                yield JobshortlistRepository.remove(findOne);
                const notiToQueu = {
                    actor_first_name: job.company.name,
                    actor_avatar: job.company.avatar,
                    type: SendNotification_1.NotificationTypeEnum.interview,
                    target_slug: job.slug,
                    target_company: job.company.slug,
                    interviewName: saveInterview.interviewer,
                    interviewDate: saveInterview.interview_date,
                    interviewLocation: saveInterview.location,
                    recipient: profile.id,
                };
                yield main_1.notificationQueue.add(notiToQueu);
                const date = moment(saveInterview.interview_date).tz('Asia/Riyadh').format('dddd Do MMMM YYYY ha');
                const jobLink = `https://castingsecret.com/job/job-page/${job.slug}/${job.company.slug}`;
                sendMail_1.sendInterviewDate(profile.user.email, profile.user.first_name, date, saveInterview.location, saveInterview.interviewer, jobLink);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
}
exports.JobsController = JobsController;
//# sourceMappingURL=JobsController.js.map