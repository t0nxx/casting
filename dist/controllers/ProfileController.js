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
const users_profile_1 = require("../models/newModels/users_profile");
class ProfileController {
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const data = yield profileRepository.find();
                response.status(200).send({ error: false, data: { data } });
            }
            catch (error) {
                response.status(400).send({ error: true, data: error.message });
            }
        });
    }
    getProfile(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const data = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['user']
                });
                const { first_name, last_name, email, username, id } = data.user;
                delete data.user;
                const responseObject = Object.assign({}, data, { auth_user: { pk: id, first_name, last_name, email, username } });
                if (!data) {
                    throw new Error('profile Not Found');
                }
                return response.status(200).send(Object.assign({ success: true }, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getProfileSettings(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const data = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['settings']
                });
                if (!data) {
                    throw new Error('profile Not Found');
                }
                return response.status(200).send(Object.assign({ success: true }, data.settings));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    updateProfile(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                yield profileRepository.update({ id: profile.id }, request.body);
                const afterUpdate = yield profileRepository.findOne({ id: profile.id });
                return response.status(200).send(Object.assign({ success: true }, afterUpdate));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=ProfileController.js.map