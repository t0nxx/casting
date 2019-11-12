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
            const company = await companyRepository.findOne({ slug: request.params.slug }, { relations: ['followers', 'profile'] });
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!company) { throw new Error('company Not Found'); }
            let is_follow = false;
            let is_admin = false;
            if (company.profile.id === profile.id) { is_admin = true; }
            const isfollowCompany = company.followers.find(f => f.id === profile.id);
            if (isfollowCompany) { is_follow = true; }
            delete company.followers;
            delete company.profile;
            return response.status(200).send({ ...company, is_follow, is_admin });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
    * @Post Company
    */
    async followCompany(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const company = await companyRepository.findOne({ slug: request.params.slug }, { relations: ['followers'] });
            const user = await profileRepository.findOne({ slug: request['user'].username });
            if (!company) { throw new Error('company Not Found'); }
            const isfollowCompany = company.followers.find(f => f.id === user.id);
            if (isfollowCompany) { throw new Error('you already follow this company'); }
            company.followers.push(user);
            await companyRepository.save(company);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
    * @Post Company
    */
    async unFollowCompany(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const company = await companyRepository.findOne({ slug: request.params.slug }, { relations: ['followers'] });
            const user = await profileRepository.findOne({ slug: request['user'].username });
            if (!company) { throw new Error('company Not Found'); }
            const isfollowCompany = company.followers.find(f => f.id === user.id);
            if (!isfollowCompany) { throw new Error('you are not follow this company'); }
            company.followers = company.followers.filter(f => f.id !== user.id);
            await companyRepository.save(company);
            return response.status(200).send({ success: true });
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
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['companies'] });
            if (!profile) { throw new Error('profile Not Found'); }
            //// phase 1 , one company only for each profile
            if (profile.companies.length >= 1) { throw new Error('you already have a company . to add more please upgrade your package'); }
            const newCompany = new Company();
            Object.assign(newCompany, request.body);

            if (request.body.tags) {
                const tags = await talentCategoryRepository.findByIds(request.body.tags);
                newCompany.tags = tags;
            }
            newCompany.profile = profile;
            newCompany.slug = newCompany.name + '-' + randomString.generate({ length: 5 });
            const save = await companyRepository.save(newCompany);
            delete save.followers;
            return response.status(200).send({ ...save });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
    * @Patch Company
    */
    async updateCompany(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const company = await companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!company) { throw new Error('company Not Found'); }
            if (company.profile.id !== profile.id) { throw new Error('Not authorize to edit this company'); }
            let newData = Object.keys(request.body).length;
            if (newData < 1) { throw new Error('no data provided to update'); }
            await companyRepository.update({ slug: request.params.slug }, request.body);
            const afterUpdate = await companyRepository.findOne({ slug: request.params.slug });
            delete company.profile;
            delete company.followers;
            return response.status(200).send({ success: true, ...afterUpdate });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
    * @Patch Company
    */
    async updateCompanyAvatar(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const company = await companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!company) { throw new Error('company Not Found'); }
            if (company.profile.id !== profile.id) { throw new Error('Not authorize to edit this company'); }
            const newAvatar = await UploadToS3(request.files.file, 'image');
            await companyRepository.update({ slug: request.params.slug }, { avatar: newAvatar });
            const afterUpdate = await companyRepository.findOne({ slug: request.params.slug });
            delete company.profile;
            delete company.followers;
            return response.status(200).send({ success: true, ...afterUpdate });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
    * @Post switch
    */
    async switchToCompany(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const company = await companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!company) { throw new Error('company Not Found'); }
            if (company.profile.id !== profile.id) { throw new Error('Not authorize to edit this company'); }
            delete company.profile;
            delete company.followers;
            return response.status(200).send({ success: true, ...company });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
       * @Patch Company
       */
    async updateCompanyCover(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const company = await companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!company) { throw new Error('company Not Found'); }
            if (company.profile.id !== profile.id) { throw new Error('Not authorize to edit this company'); }
            const newCover = await UploadToS3(request.files.file, 'image');
            await companyRepository.update({ slug: request.params.slug }, { cover: newCover });
            const afterUpdate = await companyRepository.findOne({ slug: request.params.slug });
            delete company.profile;
            delete company.followers;
            return response.status(200).send({ success: true, ...afterUpdate });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    /**
    * @Delete Company
    */
    async deleteCompany(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        try {
            const company = await companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!company) { throw new Error('company Not Found'); }
            if (company.profile.id !== profile.id) { throw new Error('Not authorize to edit this company'); }
            await companyRepository.delete({ slug: request.params.slug });
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
}
