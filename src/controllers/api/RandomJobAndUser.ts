import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Jobs } from '../../models/newModels/jobs';
import { Profile } from '../../models/newModels/users_profile';


export class RandomJobsAndUsersController {

    async getRandomJobs(request: Request, response: Response, next: NextFunction) {

        // return 10 random jobs

        const jobsRepository = getRepository(Jobs);
        try {
            const data = await jobsRepository.createQueryBuilder('job')
                .innerJoin('job.company', 'company')
                .innerJoin('job.category', 'job_category')
                .select(['job.id', 'job.title', 'job.description', 'job.location'])
                .addSelect(['company.id', 'company.avatar', 'job_category.id'])
                .orderBy('RAND()')
                .limit(10)
                .getMany();
            return response.status(200).send(data);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }

    async getRandomUsers(request: Request, response: Response, next: NextFunction) {

        // return 5 random users

        const profileRepository = getRepository(Profile);
        try {
            const data = await profileRepository.createQueryBuilder('p')
                .innerJoin('p.user', 'user')
                .innerJoin('p.categories', 'categories')
                .select(['p.id', 'p.avatar'])
                .addSelect(['user.id', 'user.first_name', 'user.last_name', 'categories.id', 'categories.name_en'])
                .orderBy('RAND()')
                .limit(5)
                .getMany();
            const res = data.map(p => {
                const formatedRes = {
                    id: p.id,
                    avatar: p.avatar,
                    first_name: p.user.first_name,
                    last_name: p.user.last_name,
                    categories: p.categories,
                }
                return formatedRes;
            })
            return response.status(200).send(res);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }


}