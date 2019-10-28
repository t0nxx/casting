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
                const company = yield companyRepository.findOne({ slug: request.params.slug });
                if (!company) {
                    throw new Error('company Not Found');
                }
                return response.status(200).send(Object.assign({ success: true }, company));
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
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
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
                return response.status(200).send({ success: true, slug: save.slug });
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