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
const company_1 = require("../models/company");
const users_profile_1 = require("../models/users_profile");
const auth_user_1 = require("../models/auth_user");
const jobs_1 = require("../models/jobs");
const pagination_1 = require("../helpers/pagination");
const jobs_applicants_1 = require("../models/jobs_applicants");
const FriendsController_1 = require("./FriendsController");
const who_see_me_1 = require("../models/who_see_me");
class SearchController {
    searchJobs(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            try {
                const q = JobRepository.createQueryBuilder('j')
                    .innerJoinAndSelect('j.company', 'company')
                    .orderBy('j.id', 'DESC');
                if (request.query.search && request.query.search !== null) {
                    q.andWhere(`j.title like '%${request.query.search}%' `);
                }
                if (request.query.have_daily_perks && request.query.have_daily_perks !== null) {
                    q.andWhere(`j.have_daily_perks = 1`);
                }
                if (request.query.have_meal && request.query.have_meal !== null) {
                    q.andWhere(`j.have_meal = 1`);
                }
                if (request.query.have_transportation && request.query.have_transportation !== null) {
                    q.andWhere(`j.have_transportation = 1`);
                }
                if (request.query.is_male && request.query.is_male !== null) {
                    q.andWhere(`j.is_male = 1`);
                }
                if (request.query.is_female && request.query.is_female !== null) {
                    q.andWhere(`j.is_female = 1`);
                }
                if (request.query.city && request.query.city !== null) {
                    q.andWhere(`j.location like '%${request.query.city}%'`);
                }
                if (request.query.tags__in && request.query.tags__in !== null) {
                    const cateArray = request.query.tags__in.split('__');
                    q.innerJoinAndSelect('j.category', 'category', `category.id In (${cateArray})`);
                }
                else {
                    q.leftJoinAndSelect('j.category', 'category');
                }
                const jobs = yield pagination_1.ApplyPagination(request, response, q, false);
                jobs.results = jobs.results.map(element => {
                    let job_category = [];
                    job_category = element.category;
                    delete element.category;
                    return Object.assign(Object.assign({}, element), { job_category });
                });
                return response.status(200).send(jobs);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    searchCompaines(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const q = companyRepository.createQueryBuilder('c')
                    .leftJoin('c.followers', 'followers')
                    .leftJoin('c.profile', 'profile')
                    .addSelect(['followers.id', 'profile.id'])
                    .orderBy('c.id', 'DESC');
                if (request.query.search && request.query.search !== null) {
                    q.andWhere(`c.name like '%${request.query.search}%' `);
                }
                if (request.query.name && request.query.name !== null) {
                    q.andWhere(`c.name like '%${request.query.name}%' `);
                }
                if (request.query.city && request.query.city !== null) {
                    q.andWhere(`c.headquarter like '%${request.query.city}%' `);
                }
                if (request.query.companySize && request.query.companySize !== null) {
                    q.andWhere(`c.size_to <= ${request.query.companySize} `);
                }
                if (request.query.tags__in && request.query.tags__in !== null) {
                    const cateArray = request.query.tags__in.split('__');
                    q.innerJoinAndSelect('c.tags', 'tag', `tag.id In (${cateArray})`);
                }
                else {
                    q.leftJoinAndSelect('c.tags', 'tags');
                }
                const compaines = yield pagination_1.ApplyPagination(request, response, q, false);
                compaines.results = compaines.results.map(element => {
                    let is_follow = false;
                    let is_admin = false;
                    if (element.profile.id === profile.id) {
                        is_admin = true;
                    }
                    const isfollowCompany = element.followers.find(f => f.id === profile.id);
                    if (isfollowCompany) {
                        is_follow = true;
                    }
                    delete element.followers;
                    delete element.profile;
                    return Object.assign(Object.assign({}, element), { is_admin, is_follow });
                });
                return response.status(200).send(compaines);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    searchPeople(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                const q = profileRepository.createQueryBuilder('p')
                    .innerJoinAndMapOne('p.user', auth_user_1.User, 'user', 'user.id = p.userId')
                    .leftJoinAndSelect('p.weight', 'weight')
                    .leftJoinAndSelect('p.height', 'height')
                    .leftJoinAndSelect('p.eye', 'eye')
                    .leftJoinAndSelect('p.hair', 'hair')
                    .leftJoinAndSelect('p.build', 'build')
                    .leftJoinAndSelect('p.ethnicity', 'ethnicity');
                if (request.query.search && request.query.search !== null) {
                    q.andWhere(`user.username like '%${request.query.search}%' `);
                }
                if (request.query.fname && request.query.fname !== null) {
                    q.andWhere(`user.first_name like '%${request.query.fname}%' `);
                }
                if (request.query.lname && request.query.lname !== null) {
                    q.andWhere(`user.last_name like '%${request.query.lname}%' `);
                }
                if (request.query.city && request.query.city !== null) {
                    q.andWhere(`p.location like '%${request.query.city}%' `);
                }
                if (request.query.Age && request.query.Age !== null) {
                    const age_from = parseInt(request.query.Age.split('__')[0], 10);
                    const age_to = parseInt(request.query.Age.split('__')[1], 10);
                    q.andWhere(`p.age_from >= ${age_from} and p.age_to <= ${age_to}`);
                }
                if (request.query.ethnicity && request.query.ethnicity !== null) {
                    const ethnicityArray = request.query.ethnicity.split(',');
                    q.andWhere(`p.ethnicity.id In (${ethnicityArray})`);
                }
                if (request.query.build && request.query.build !== null) {
                    const buildArray = request.query.build.split(',');
                    q.andWhere(`p.build.id In (${buildArray})`);
                }
                if (request.query.hair && request.query.hair !== null) {
                    const hairArray = request.query.hair.split(',');
                    q.andWhere(`p.hair.id In (${hairArray})`);
                }
                if (request.query.tags__in && request.query.tags__in !== null) {
                    const cateArray = request.query.tags__in.split('__');
                    q.innerJoinAndSelect('p.categories', 'categories', `categories.id In (${cateArray})`);
                }
                if ((request.query.has_photo && request.query.has_photo !== null) || (request.query.has_audio && request.query.has_audio !== null) || (request.query.has_video && request.query.has_video !== null)) {
                    if (request.query.has_photo) {
                        q.innerJoin('p.activity_attachment', 'activity_attachment_photo')
                            .andWhere(`activity_attachment_photo.type like 'IMG' `)
                            .addSelect(['activity_attachment_photo.id', 'activity_attachment_photo.type']);
                    }
                    if (request.query.has_audio) {
                        q.innerJoin('p.activity_attachment', 'activity_attachment_audio')
                            .andWhere(`activity_attachment_audio.type like 'AUDIO' `)
                            .addSelect(['activity_attachment_audio.id', 'activity_attachment_audio.type']);
                    }
                    if (request.query.has_video) {
                        q.innerJoin('p.activity_attachment', 'activity_attachment_video')
                            .andWhere(`activity_attachment_video.type like 'VIDEO' `)
                            .addSelect(['activity_attachment_video.id', 'activity_attachment_video.type']);
                    }
                }
                else {
                    q.leftJoin('p.activity_attachment', 'activity_attachment')
                        .addSelect(['activity_attachment.id', 'activity_attachment.type']);
                }
                const people = yield pagination_1.ApplyPagination(request, response, q, false);
                const friends = yield FriendsController_1.getAllFriendSharedBtwnApp(request, response, user.slug);
                const friendsArray = friends.map(e => e.pk);
                people.results = people.results.map(e => {
                    const { first_name, last_name, email, username } = e['user'];
                    const auth_user = {
                        first_name, last_name, email, username, pk: e.id,
                    };
                    delete e['user'];
                    const has_photo = e.activity_attachment.some(a => a.type === 'IMG');
                    const has_audio = e.activity_attachment.some(a => a.type === 'AUDIO');
                    const has_video = e.activity_attachment.some(a => a.type === 'VIDEO');
                    let is_friends = false;
                    let isFriendWithMe = friendsArray.includes(e.id);
                    if (isFriendWithMe) {
                        is_friends = true;
                    }
                    return Object.assign(Object.assign({}, e), { auth_user, is_friends, has_photo, has_video, has_audio });
                });
                people.results = people.results.filter(e => e.id !== user.id);
                return response.status(200).send(people);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    searchPeopleLandingPage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const q = profileRepository.createQueryBuilder('p')
                    .innerJoinAndMapOne('p.user', auth_user_1.User, 'user', 'user.id = p.userId')
                    .leftJoinAndSelect('p.weight', 'weight')
                    .leftJoinAndSelect('p.height', 'height')
                    .leftJoinAndSelect('p.eye', 'eye')
                    .leftJoinAndSelect('p.hair', 'hair')
                    .leftJoinAndSelect('p.build', 'build')
                    .leftJoinAndSelect('p.ethnicity', 'ethnicity');
                if (request.query.search && request.query.search !== null) {
                    q.andWhere(`user.username like '%${request.query.search}%' or user.first_name like '%${request.query.search}%' or user.last_name like '%${request.query.search}%'`);
                }
                const people = yield pagination_1.ApplyPagination(request, response, q, false);
                people.results = people.results.map(e => {
                    const { first_name, last_name, email, username } = e['user'];
                    const auth_user = {
                        first_name, last_name, email, username, pk: e.id,
                    };
                    const has_photo = true;
                    const has_audio = true;
                    const has_video = true;
                    const is_friends = false;
                    return Object.assign(Object.assign({}, e), { auth_user, is_friends, has_photo, has_video, has_audio });
                });
                return response.status(200).send(people);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getWhoSeeMePeople(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            const whoSeeMeRepository = typeorm_1.getRepository(who_see_me_1.WhoSeeMe);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                const q = whoSeeMeRepository.createQueryBuilder('w')
                    .innerJoinAndMapOne('w.viewer', users_profile_1.Profile, 'profile', 'profile.id = w.viewer')
                    .innerJoinAndMapOne('w.user', auth_user_1.User, 'user', 'profile.userId = user.id')
                    .where(`w.viewed = ${user.id}`);
                const people = yield pagination_1.ApplyPagination(request, response, q, false);
                const friends = yield FriendsController_1.getAllFriendSharedBtwnApp(request, response, user.slug);
                const friendsArray = friends.map(e => e.pk);
                people.results = people.results.map(e => {
                    const { first_name, last_name, email, username } = e['user'];
                    const auth_user = {
                        first_name, last_name, email, username, pk: e.viewer.id,
                    };
                    delete e['user'];
                    let is_friends = false;
                    let isFriendWithMe = friendsArray.includes(e.viewer.id);
                    if (isFriendWithMe) {
                        is_friends = true;
                    }
                    return Object.assign(Object.assign({}, e.viewer), { auth_user, is_friends });
                });
                return response.status(200).send(people);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    searchMYFollowedCompaines(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                const q = companyRepository.createQueryBuilder('c')
                    .leftJoin('c.followers', 'followers')
                    .leftJoinAndSelect('c.tags', 'tags')
                    .where(`followers.id IN (${user.id})`);
                const myFollowed = yield pagination_1.ApplyPagination(request, response, q, false);
                return response.status(200).send(myFollowed);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getSuitesMeJobs(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobRepository = typeorm_1.getRepository(jobs_1.Jobs);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['categories'] });
                const myCate = user.categories.map(e => e.id);
                const q = JobRepository.createQueryBuilder('j')
                    .innerJoinAndSelect('j.company', 'company')
                    .orderBy('j.id', 'DESC');
                if (myCate.length > 1) {
                    q.innerJoinAndSelect('j.category', 'category', `category.id In (${myCate})`);
                }
                const jobs = yield pagination_1.ApplyPagination(request, response, q, false);
                jobs.results = jobs.results.map(element => {
                    let job_category = [];
                    job_category = element.category;
                    delete element.category;
                    return Object.assign(Object.assign({}, element), { job_category });
                });
                return response.status(200).send(jobs);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getMyAppliedJobs(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const JobApplicantsRepository = typeorm_1.getRepository(jobs_applicants_1.JobApplicants);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                const q = JobApplicantsRepository.createQueryBuilder('j')
                    .innerJoinAndSelect('j.job', 'job')
                    .innerJoinAndMapOne('j.company', company_1.Company, 'company', 'company.id = job.companyId')
                    .where(`j.profileId = ${user.id}`)
                    .orderBy('j.id', 'DESC');
                const jobs = yield pagination_1.ApplyPagination(request, response, q, false);
                jobs.results = jobs.results.map(element => {
                    return Object.assign(Object.assign({}, element.job), { company: element.company });
                });
                return response.status(200).send(jobs);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
}
exports.SearchController = SearchController;
//# sourceMappingURL=SearchController.js.map