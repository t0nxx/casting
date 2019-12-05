
import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Company } from '../models/newModels/company';
import { Profile } from '../models/newModels/users_profile';
import { User } from '../models/newModels/auth_user';
import { TalentCategories } from '../models/newModels/talent_categories';
import { Jobs } from '../models/newModels/jobs';
import { ApplyPagination } from '../helpers/pagination';
export class SearchController {


    async searchJobs(request: any, response: Response, next: NextFunction) {

        const companyRepository = getRepository(Company);
        const JobRepository = getRepository(Jobs);
        let m = new Jobs()
        try {
            const q = JobRepository.createQueryBuilder('j')
                .innerJoinAndSelect('j.company', 'company')

                .orderBy('j.id', 'DESC');

            if (request.query.search) {
                // come from navbar
                q.andWhere(`j.title like '%${request.query.search}%' `);
            }
            if (request.query.title) {
                q.andWhere(`j.title like '%${request.query.title}%' `);
            }
            if (request.query.description) {
                q.andWhere(`j.description like '%${request.query.description}%' `);
            }
            if (request.query.have_daily_perks) {
                q.andWhere(`j.have_daily_perks = 1`);
            }
            if (request.query.have_meal) {
                q.andWhere(`j.have_meal = 1`);
            }
            if (request.query.have_space_rest) {
                q.andWhere(`j.have_space_rest = 1`);
            }
            if (request.query.have_transportation) {
                q.andWhere(`j.have_transportation = 1`);
            }
            if (request.query.is_male) {
                q.andWhere(`j.is_male = 1`);
            }
            if (request.query.is_female) {
                q.andWhere(`j.is_female = 1`);
            }
            if (request.query.category) {
                const cateArray: string = request.query.category.split(',')
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
            const user = await profileRepository.findOne({ slug: request['user'].username });
            const q = companyRepository.createQueryBuilder('c')
                .leftJoin('c.followers', 'followers')
                // .where(`followers.id NOT IN (${user.id})`)
                .orderBy('c.id', 'DESC');

            if (request.query.search) {
                // come from navbar
                q.andWhere(`c.name like '%${request.query.search}%' `);
            }
            if (request.query.name) {
                q.andWhere(`c.name like '%${request.query.name}%' `);
            }
            if (request.query.size_from) {
                q.andWhere(`c.size_from >= ${request.query.size_from} `);
            }
            if (request.query.size_to) {
                q.andWhere(`c.size_to <= ${request.query.size_to} `);
            }

            if (request.query.tags) {
                const cateArray: string = request.query.tags.split(',')
                q.innerJoinAndSelect('c.tags', 'tag', `tag.id In (${cateArray})`);
            } else {
                // else for get all categories like normal , not for search
                q.leftJoinAndSelect('c.tags', 'tags')
            }
            const compaines = await ApplyPagination(request, response, q, false);
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
            const q = profileRepository.createQueryBuilder('p')
                .innerJoinAndMapOne('p.user', User, 'user', 'user.id = p.userId')
                .leftJoinAndSelect('p.weight', 'weight')
                .leftJoinAndSelect('p.height', 'height')
                .leftJoinAndSelect('p.eye', 'eye')
                .leftJoinAndSelect('p.hair', 'hair')
                .leftJoinAndSelect('p.build', 'build')
                .leftJoinAndSelect('p.ethnicity', 'ethnicity');

            if (request.query.search) {
                /// come from navbar
                q.andWhere(`user.first_name like '%${request.query.search}%' `);
            }

            if (request.query.first_name) {
                q.andWhere(`user.first_name like '%${request.query.first_name}%' `);
            }
            if (request.query.last_name) {
                q.andWhere(`user.last_name like '%${request.query.last_name}%' `);
            }
            if (request.query.username) {
                q.andWhere(`user.username like '%${request.query.username}%' `);
            }
            // if (request.query.size_from) {
            //     q.andWhere(`c.size_from >= ${request.query.size_from} `);
            // }
            // if (request.query.size_to) {
            //     q.andWhere(`c.size_to <= ${request.query.size_to} `);
            // }

            if (request.query.tags) {
                const cateArray: string = request.query.tags.split(',')
                q.innerJoinAndSelect('c.tags', 'tag', `tag.id In (${cateArray})`);
            } else {
                // else for get all categories like normal , not for search
                // q.leftJoinAndSelect('c.tags', 'tags')
            }
            const people = await ApplyPagination(request, response, q, false);
            people.results = people.results.map(e => {
                const { first_name, last_name, email, username } = e['user'];
                const auth_user = {
                    first_name, last_name, email, username, pk: e.id,
                };
                delete e['user'];
                return { ...e, auth_user }
            })
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

}
