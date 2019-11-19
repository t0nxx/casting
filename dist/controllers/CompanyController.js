"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const randomString = require("randomstring");
const users_profile_1 = require("../models/newModels/users_profile");
const talent_categories_1 = require("../models/newModels/talent_categories");
const company_1 = require("../models/newModels/company");
const awsUploader_1 = require("../helpers/awsUploader");
class CompanyController {
    getAllCompanies(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const profile = yield profileRepository.findOne({ slug: request.params.slug }, { relations: ['companies'] });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const companies = profile.companies ? profile.companies : [];
                return response.status(200).send(companies);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    GetOneCompany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['followers', 'profile', 'tags'] });
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!company) {
                    throw new Error('company Not Found');
                }
                let is_follow = false;
                let is_admin = false;
                if (company.profile.id === profile.id) {
                    is_admin = true;
                }
                const isfollowCompany = company.followers.find(f => f.id === profile.id);
                if (isfollowCompany) {
                    is_follow = true;
                }
                delete company.followers;
                delete company.profile;
                return response.status(200).send(Object.assign({}, company, { is_follow, is_admin }));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    followCompany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['followers'] });
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                if (!company) {
                    throw new Error('company Not Found');
                }
                const isfollowCompany = company.followers.find(f => f.id === user.id);
                if (isfollowCompany) {
                    throw new Error('you already follow this company');
                }
                company.followers.push(user);
                yield companyRepository.save(company);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    unFollowCompany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['followers'] });
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                if (!company) {
                    throw new Error('company Not Found');
                }
                const isfollowCompany = company.followers.find(f => f.id === user.id);
                if (!isfollowCompany) {
                    throw new Error('you are not follow this company');
                }
                company.followers = company.followers.filter(f => f.id !== user.id);
                yield companyRepository.save(company);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    createCompany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['companies'] });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                if (profile.companies.length >= 1) {
                    throw new Error('you already have a company . to add more please upgrade your package');
                }
                const newCompany = new company_1.Company();
                Object.assign(newCompany, request.body);
                if (request.body.tags) {
                    const tags = yield talentCategoryRepository.findByIds(request.body.tags);
                    newCompany.tags = tags;
                }
                newCompany.profile = profile;
                newCompany.slug = newCompany.name + '-' + randomString.generate({ length: 5 });
                const save = yield companyRepository.save(newCompany);
                delete save.followers;
                return response.status(200).send(Object.assign({}, save));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    updateCompany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile', 'tags'] });
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!company) {
                    throw new Error('company Not Found');
                }
                if (company.profile.id !== profile.id) {
                    throw new Error('Not authorize to edit this company');
                }
                let newData = Object.keys(request.body).length;
                if (newData < 1) {
                    throw new Error('no data provided to update');
                }
                delete request.body.is_admin;
                delete request.body.is_follow;
                if (request.body.tags) {
                    const tags = yield talentCategoryRepository.findByIds(request.body.tags);
                    company.tags = [...company.tags, ...tags];
                    yield companyRepository.save(company);
                    delete request.body.tags;
                }
                yield companyRepository.update({ slug: request.params.slug }, request.body);
                const afterUpdate = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile', 'followers', 'tags'] });
                let is_follow = false;
                let is_admin = false;
                if (afterUpdate.profile.id === profile.id) {
                    is_admin = true;
                }
                const isfollowCompany = afterUpdate.followers.find(f => f.id === profile.id);
                if (isfollowCompany) {
                    is_follow = true;
                }
                delete afterUpdate.followers;
                delete afterUpdate.profile;
                return response.status(200).send(Object.assign({}, afterUpdate, { is_follow, is_admin }));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    removeTagsCompany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile', 'tags'] });
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!company) {
                    throw new Error('company Not Found');
                }
                if (company.profile.id !== profile.id) {
                    throw new Error('Not authorize to edit this company');
                }
                let newData = Object.keys(request.body).length;
                if (newData < 1) {
                    throw new Error('no data provided to update');
                }
                delete request.body.is_admin;
                delete request.body.is_follow;
                if (request.body.tags) {
                    let { tags } = request.body;
                    company.tags = company.tags.filter(e => tags.indexOf(e.id) === -1);
                    yield companyRepository.save(company);
                    delete request.body.tags;
                }
                const afterUpdate = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile', 'followers', 'tags'] });
                let is_follow = false;
                let is_admin = false;
                if (afterUpdate.profile.id === profile.id) {
                    is_admin = true;
                }
                const isfollowCompany = afterUpdate.followers.find(f => f.id === profile.id);
                if (isfollowCompany) {
                    is_follow = true;
                }
                delete afterUpdate.followers;
                delete afterUpdate.profile;
                return response.status(200).send(Object.assign({}, afterUpdate, { is_follow, is_admin }));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    updateCompanyAvatar(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!company) {
                    throw new Error('company Not Found');
                }
                if (company.profile.id !== profile.id) {
                    throw new Error('Not authorize to edit this company');
                }
                const newAvatar = yield awsUploader_1.UploadToS3(request.files.file, 'image');
                yield companyRepository.update({ slug: request.params.slug }, { avatar: newAvatar });
                const afterUpdate = yield companyRepository.findOne({ slug: request.params.slug });
                delete company.profile;
                delete company.followers;
                return response.status(200).send(Object.assign({ success: true }, afterUpdate));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    switchToCompany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile', 'tags'] });
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!company) {
                    throw new Error('company Not Found');
                }
                if (company.profile.id !== profile.id) {
                    throw new Error('Not authorize to edit this company');
                }
                delete company.profile;
                delete company.followers;
                return response.status(200).send(Object.assign({ success: true }, company));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    updateCompanyCover(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!company) {
                    throw new Error('company Not Found');
                }
                if (company.profile.id !== profile.id) {
                    throw new Error('Not authorize to edit this company');
                }
                const newCover = yield awsUploader_1.UploadToS3(request.files.file, 'image');
                yield companyRepository.update({ slug: request.params.slug }, { cover: newCover });
                const afterUpdate = yield companyRepository.findOne({ slug: request.params.slug });
                delete company.profile;
                delete company.followers;
                return response.status(200).send(Object.assign({ success: true }, afterUpdate));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    deleteCompany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            try {
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!company) {
                    throw new Error('company Not Found');
                }
                if (company.profile.id !== profile.id) {
                    throw new Error('Not authorize to edit this company');
                }
                yield companyRepository.delete({ slug: request.params.slug });
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.CompanyController = CompanyController;
//# sourceMappingURL=CompanyController.js.map