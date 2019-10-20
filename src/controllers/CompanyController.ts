import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { Profile } from '../models/newModels/users_profile';
import { TalentCategories } from '../models/newModels/talent_categories';
import { Company } from '../models/newModels/company';
import { UploadToS3 } from '../helpers/awsUploader';

export class CompanyController {
    /**
       * @Get All  companies of user
       */

    async getAllCompanies(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        try {
            const profile = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['companies'] });
            if (!profile) { throw new Error('profile Not Found'); }
            const companies = profile.companies ? profile.companies : [];
            return response.status(200).send(companies);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
    * @Get Company
    */
    async GetOneCompany(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const company = await companyRepository.findOne({ slug: request.params.slug });
            if (!company) { throw new Error('company Not Found'); }
            return response.status(200).send({ success: true, ...company });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }


    /**
    * @Create Company
    */
    async createCompany(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        const talentCategoryRepository = getRepository(TalentCategories);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const newCompany = new Company();
            Object.assign(newCompany, request.body);

            if (request.body.tags) {
                const tags = await talentCategoryRepository.findByIds(request.body.tags);
                newCompany.tags = tags;
            }
            newCompany.profile = profile;
            newCompany.slug = newCompany.name + '-' + randomString.generate({ length: 5 });
            const save = await companyRepository.save(newCompany);
            return response.status(200).send({ success: true, slug: save.slug });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
}