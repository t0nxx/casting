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
const jobs_1 = require("../../models/jobs");
const users_profile_1 = require("../../models/users_profile");
class RandomJobsAndUsersController {
    getRandomJobs(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobsRepository = typeorm_1.getRepository(jobs_1.Jobs);
            try {
                const data = yield jobsRepository.createQueryBuilder('job')
                    .innerJoin('job.company', 'company')
                    .innerJoin('job.category', 'job_category')
                    .select(['job.id', 'job.title', 'job.description', 'job.location'])
                    .addSelect(['company.id', 'company.avatar', 'job_category.id'])
                    .orderBy('RAND()')
                    .limit(10)
                    .getMany();
                return response.status(200).send(data);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getRandomUsers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const data = yield profileRepository.createQueryBuilder('p')
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
                    };
                    return formatedRes;
                });
                return response.status(200).send(res);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.RandomJobsAndUsersController = RandomJobsAndUsersController;
//# sourceMappingURL=RandomJobAndUser.js.map