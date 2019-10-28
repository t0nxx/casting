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
const talent_categories_1 = require("../../models/newModels/talent_categories");
const class_transformer_validator_1 = require("class-transformer-validator");
class TalentCategoriesController {
    getAllTalentCategories(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const talentRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const data = yield talentRepository.find();
                return response.status(200).send(data);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    createNewCategory(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const talentRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const validateBody = yield class_transformer_validator_1.transformAndValidate(talent_categories_1.TalentCategories, request.body);
                const enNameExist = yield talentRepository.findOne({ name_en: request.body.name_en });
                const arNameExist = yield talentRepository.findOne({ name_ar: request.body.name_ar });
                if (enNameExist) {
                    throw new Error('name_en already exist');
                }
                if (arNameExist) {
                    throw new Error('name_ar already exist');
                }
                const newCategory = new talent_categories_1.TalentCategories();
                Object.assign(newCategory, validateBody);
                const data = yield talentRepository.save(newCategory);
                return response.status(200).send(data);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.TalentCategoriesController = TalentCategoriesController;
//# sourceMappingURL=TalentCategoriesController.js.map