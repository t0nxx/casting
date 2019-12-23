
import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Company } from '../models/newModels/company';
import { Profile } from '../models/newModels/users_profile';
import { User } from '../models/newModels/auth_user';
import { TalentCategories } from '../models/newModels/talent_categories';
import { Jobs } from '../models/newModels/jobs';
import { ApplyPagination } from '../helpers/pagination';
import { JobApplicants } from '../models/newModels/jobs_applicants';
import { getAllFriendSharedBtwnApp } from './FriendsController';
import { WhoSeeMe } from '../models/newModels/who_see_me';
export class SearchController {


    async searchJobs(request: any, response: Response, next: NextFunction) {

        const companyRepository = getRepository(Company);
        const JobRepository = getRepository(Jobs);
        try {
            const q = JobRepository.createQueryBuilder('j')
                .innerJoinAndSelect('j.company', 'company')

                .orderBy('j.id', 'DESC');

            if (request.query.search && request.query.search !== null) {
                // come from navbar
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
                const cateArray: string = request.query.tags__in.split('__');
                q.innerJoinAndSelect('j.category', 'category', `category.id In (${cateArray})`);
            } else {
                // else for get all categories like normal , not for search
                q.leftJoinAndSelect('j.category', 'category')
            }
            const jobs = await ApplyPagination(request, response, q, false);
            jobs.results = jobs.results.map(element => {
                let job_category = [];
                job_category = element.category;
                delete element.category;
                return { ...element, job_category }
            });
            return response.status(200).send(jobs);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async searchCompaines(request: any, response: Response, next: NextFunction) {
        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const q = companyRepository.createQueryBuilder('c')
                .leftJoin('c.followers', 'followers')
                .leftJoin('c.profile', 'profile')
                // .where(`followers.id NOT IN (${user.id})`)
                .addSelect(['followers.id', 'profile.id'])
                .orderBy('c.id', 'DESC');

            if (request.query.search && request.query.search !== null) {
                // come from navbar
                q.andWhere(`c.name like '%${request.query.search}%' `);
            }
            if (request.query.name && request.query.name !== null) {
                q.andWhere(`c.name like '%${request.query.name}%' `);
            }

            if (request.query.city && request.query.city !== null) {
                q.andWhere(`c.headquarter like '%${request.query.city}%' `);
            }
            // if (request.query.size_from) {
            //     q.andWhere(`c.size_from >= ${request.query.size_from} `);
            // }
            if (request.query.companySize && request.query.companySize !== null) {
                q.andWhere(`c.size_to <= ${request.query.companySize} `);
            }

            if (request.query.tags__in && request.query.tags__in !== null) {
                const cateArray: string = request.query.tags__in.split('__');
                q.innerJoinAndSelect('c.tags', 'tag', `tag.id In (${cateArray})`);
            } else {
                // else for get all categories like normal , not for search
                q.leftJoinAndSelect('c.tags', 'tags')
            }
            const compaines = await ApplyPagination(request, response, q, false);

            compaines.results = compaines.results.map(element => {
                let is_follow = false;
                let is_admin = false;
                if (element.profile.id === profile.id) { is_admin = true; }
                const isfollowCompany = element.followers.find(f => f.id === profile.id);
                if (isfollowCompany) { is_follow = true; }
                delete element.followers;
                delete element.profile;
                return { ...element, is_admin, is_follow }
            });


            return response.status(200).send(compaines);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async searchPeople(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const userRepository = getRepository(User);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username });
            const q = profileRepository.createQueryBuilder('p')
                .innerJoinAndMapOne('p.user', User, 'user', 'user.id = p.userId')
                .leftJoinAndSelect('p.weight', 'weight')
                .leftJoinAndSelect('p.height', 'height')
                .leftJoinAndSelect('p.eye', 'eye')
                .leftJoinAndSelect('p.hair', 'hair')
                .leftJoinAndSelect('p.build', 'build')
                .leftJoinAndSelect('p.ethnicity', 'ethnicity');


            if (request.query.search && request.query.search !== null) {
                /// come from navbar
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
            //////////////////////////////////////////////////////////////////////////////////////////
            if (request.query.ethnicity && request.query.ethnicity !== null) {
                const ethnicityArray: string = request.query.ethnicity.split(',');
                q.andWhere(`p.ethnicity.id In (${ethnicityArray})`);
            }

            if (request.query.build && request.query.build !== null) {
                const buildArray: string = request.query.build.split(',');
                q.andWhere(`p.build.id In (${buildArray})`);
            }
            if (request.query.hair && request.query.hair !== null) {
                const hairArray: string = request.query.hair.split(',');
                q.andWhere(`p.hair.id In (${hairArray})`);
            }
            // if (request.query.hobbies) {
            //     const hobbiesArray: string = request.query.hobbies.split(',');
            //     q.andWhere(`p.hobbies.id In (${hobbiesArray})`);
            // }
            ///////////////////////////////////////////////////////////////////////////////////////////
            if (request.query.tags__in && request.query.tags__in !== null) {
                const cateArray: string = request.query.tags__in.split('__');
                q.innerJoinAndSelect('p.categories', 'categories', `categories.id In (${cateArray})`);
            }
            ////////////////////////////////////////////////////////////////////////////////////////////

            // tslint:disable-next-line: max-line-length
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
            } else {
                // hase video , audi , imge ..etc 
                q.leftJoin('p.activity_attachment', 'activity_attachment')
                    .addSelect(['activity_attachment.id', 'activity_attachment.type']);
            }


            const people = await ApplyPagination(request, response, q, false);

            // add is friends or not 
            const friends: any = await getAllFriendSharedBtwnApp(request, response, user.slug);
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
                if (isFriendWithMe) { is_friends = true; }

                return { ...e, auth_user, is_friends, has_photo, has_video, has_audio }
            });
            // not return the same user in search
            people.results = people.results.filter(e => e.id !== user.id);
            return response.status(200).send(people);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async getWhoSeeMePeople(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const userRepository = getRepository(User);
        const whoSeeMeRepository = getRepository(WhoSeeMe);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username });
            const q = whoSeeMeRepository.createQueryBuilder('w')
                .innerJoinAndMapOne('w.viewer', Profile, 'profile', 'profile.id = w.viewer')
                .innerJoinAndMapOne('w.user', User, 'user', 'profile.userId = user.id')
                .where(`w.viewed = ${user.id}`);
            // .where(`p.who_see_me = ${user.id}`);


            const people = await ApplyPagination(request, response, q, false);

            // add is friends or not 
            const friends: any = await getAllFriendSharedBtwnApp(request, response, user.slug);
            const friendsArray = friends.map(e => e.pk);

            people.results = people.results.map(e => {
                const { first_name, last_name, email, username } = e['user'];
                const auth_user = {
                    first_name, last_name, email, username, pk: e.viewer.id,
                };
                delete e['user'];

                let is_friends = false;
                let isFriendWithMe = friendsArray.includes(e.viewer.id);
                if (isFriendWithMe) { is_friends = true; }
                return { ...e.viewer, auth_user, is_friends }
            });
            // // not return the same user in search
            // people.results = people.results.filter(e => e.id !== user.id);
            return response.status(200).send(people);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async searchMYFollowedCompaines(request: any, response: Response, next: NextFunction) {
        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username });
            const q = companyRepository.createQueryBuilder('c')
                .leftJoin('c.followers', 'followers')
                .leftJoinAndSelect('c.tags', 'tags')
                .where(`followers.id IN (${user.id})`);
            const myFollowed = await ApplyPagination(request, response, q, false);
            return response.status(200).send(myFollowed);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async getSuitesMeJobs(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const JobRepository = getRepository(Jobs);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['categories'] });
            const myCate = user.categories.map(e => e.id);

            const q = JobRepository.createQueryBuilder('j')
                .innerJoinAndSelect('j.company', 'company')
                .innerJoinAndSelect('j.category', 'category', `category.id In (${myCate})`)
                .orderBy('j.id', 'DESC');

            const jobs = await ApplyPagination(request, response, q, false);
            jobs.results = jobs.results.map(element => {
                let job_category = [];
                job_category = element.category;
                delete element.category;
                return { ...element, job_category }
            });
            return response.status(200).send(jobs);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async getMyAppliedJobs(request: any, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const JobApplicantsRepository = getRepository(JobApplicants);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username })
            const q = JobApplicantsRepository.createQueryBuilder('j')
                .innerJoinAndSelect('j.job', 'job')
                .innerJoinAndMapOne('j.company', Company, 'company', 'company.id = job.companyId')
                .where(`j.profileId = ${user.id}`)
                .orderBy('j.id', 'DESC');

            const jobs = await ApplyPagination(request, response, q, false);
            jobs.results = jobs.results.map(element => {
                return { ...element.job, company: element.company }
            });

            return response.status(200).send(jobs);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }


}
