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
const height_range_lookup_1 = require("../../models/newModels/height_range_lookup");
const weight_range_lookup_1 = require("../../models/newModels/weight_range_lookup");
const build_lookup_1 = require("../../models/newModels/build_lookup");
const hair_lookup_1 = require("../../models/newModels/hair_lookup");
const eye_lookup_1 = require("../../models/newModels/eye_lookup");
const ethnicities_lookup_1 = require("../../models/newModels/ethnicities_lookup");
const profile_hobbies_1 = require("../../models/newModels/profile_hobbies");
const talent_categories_1 = require("../../models/newModels/talent_categories");
function identifyLookupRepo(lookupString) {
    if (lookupString == 'height') {
        return height_range_lookup_1.HeightRangeLookup;
    }
    else if (lookupString == 'weight') {
        return weight_range_lookup_1.WeightRangeLookup;
    }
    else if (lookupString == 'build') {
        return build_lookup_1.BuildLookup;
    }
    else if (lookupString == 'hair') {
        return hair_lookup_1.HairLookup;
    }
    else if (lookupString == 'eye') {
        return eye_lookup_1.EyeLookup;
    }
    else if (lookupString == 'ethnicitie') {
        return ethnicities_lookup_1.EthnicitiesLookup;
    }
    else if (lookupString == 'hobby') {
        return profile_hobbies_1.Hobbies;
    }
    else if (lookupString == 'talent') {
        return talent_categories_1.TalentCategories;
    }
    else {
        return '';
    }
}
class AdminLookupsController {
    getAllTemplate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lookupRepo } = request.params;
                const repo = identifyLookupRepo(lookupRepo);
                const LookupRepository = typeorm_1.getRepository(repo);
                const [data, count] = yield LookupRepository.findAndCount({ order: { id: 'DESC' } });
                return response.status(200).send({ data, count });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getOneTemplate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lookupRepo } = request.params;
                const repo = identifyLookupRepo(lookupRepo);
                const LookupRepository = typeorm_1.getRepository(repo);
                const data = yield LookupRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!data) {
                    throw new Error('given id not found');
                }
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    createNewTemplate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lookupRepo } = request.params;
                if (!request.body.name) {
                    throw new Error('name is required');
                }
                const repo = identifyLookupRepo(lookupRepo);
                const LookupRepository = typeorm_1.getRepository(repo);
                let item;
                switch (lookupRepo) {
                    case 'height':
                        item = new height_range_lookup_1.HeightRangeLookup();
                        break;
                    case 'weight':
                        item = new weight_range_lookup_1.WeightRangeLookup();
                        break;
                    case 'build':
                        item = new build_lookup_1.BuildLookup();
                        break;
                    case 'hair':
                        item = new hair_lookup_1.HairLookup();
                        break;
                    case 'eye':
                        item = new eye_lookup_1.EyeLookup();
                        break;
                    case 'ethnicitie':
                        item = new ethnicities_lookup_1.EthnicitiesLookup();
                        break;
                    case 'hobby':
                        item = new profile_hobbies_1.Hobbies();
                        break;
                    case 'talent':
                        item = new talent_categories_1.TalentCategories();
                        break;
                    default:
                        item = '';
                        break;
                }
                if (lookupRepo !== 'talent') {
                    item.name = request.body.name;
                }
                else {
                    item.name_en = request.body.name_en;
                    item.name_ar = request.body.name_ar;
                }
                const data = yield LookupRepository.save(item);
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    updateOneTemplate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lookupRepo } = request.params;
                const repo = identifyLookupRepo(lookupRepo);
                const LookupRepository = typeorm_1.getRepository(repo);
                const find = yield LookupRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!find) {
                    throw new Error('given id not found');
                }
                yield LookupRepository.update({ id: parseInt(request.params.id, 10) }, request.body);
                const data = yield LookupRepository.findOne({ id: parseInt(request.params.id, 10) });
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    deleteOneTemplate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lookupRepo } = request.params;
                const repo = identifyLookupRepo(lookupRepo);
                const LookupRepository = typeorm_1.getRepository(repo);
                const find = yield LookupRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!find) {
                    throw new Error('given id not found');
                }
                yield LookupRepository.delete({ id: parseInt(request.params.id, 10) });
                return response.status(200).send({ data: find });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.AdminLookupsController = AdminLookupsController;
//# sourceMappingURL=AdminLookups.js.map