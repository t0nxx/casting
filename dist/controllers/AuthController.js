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
const bcryptjs_1 = require("bcryptjs");
const class_transformer_validator_1 = require("class-transformer-validator");
const auth_user_1 = require("../models/newModels/auth_user");
const GnerateJwt_1 = require("../helpers/GnerateJwt");
const users_profile_1 = require("../models/newModels/users_profile");
const profile_settings_1 = require("../models/newModels/profile_settings");
const talent_categories_1 = require("../models/newModels/talent_categories");
class AuthController {
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const user = yield userRepository.findOne({ username: request.body.username }, {});
                if (!user) {
                    throw new Error('invalid username / password');
                }
                const checkPass = yield bcryptjs_1.compare(request.body.password, user.password);
                if (!checkPass) {
                    throw new Error('invalid username / password');
                }
                const token = yield GnerateJwt_1.generateJwtToken({
                    id: user.id,
                    isAdmin: user.isAdmin,
                });
                return response.status(200).send({ success: true, token, user: { slug: user.username } });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    signUp(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const validateBody = yield class_transformer_validator_1.transformAndValidate(auth_user_1.User, request.body);
                if (request.body.password1 !== request.body.password2) {
                    throw new Error('password1 and password2 not matched');
                }
                const usernameExist = yield userRepository.findOne({ username: request.body.username });
                const emailExist = yield userRepository.findOne({ email: request.body.email });
                if (usernameExist) {
                    throw new Error('username already exist');
                }
                if (emailExist) {
                    throw new Error('email already exist');
                }
                const newUser = new auth_user_1.User();
                Object.assign(newUser, validateBody);
                newUser.password = yield bcryptjs_1.hash(request.body.password1, 10);
                const create = yield userRepository.save(newUser);
                const categories = yield talentCategoryRepository.findByIds(request.body.category);
                const newProfile = new users_profile_1.Profile();
                newProfile.slug = create.username;
                newProfile.user = create;
                newProfile.categories = categories;
                const createProfile = yield profileRepository.save(newProfile);
                const newProfileSettings = new profile_settings_1.ProfileSettings();
                newProfileSettings.profile = createProfile;
                const crateProfileSettings = yield profileSettingsRepository.save(newProfileSettings);
                const token = yield GnerateJwt_1.generateJwtToken({
                    id: create.id,
                    isAdmin: create.isAdmin,
                });
                return response.status(200).send({ success: true, token, user: { slug: create.username } });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    verifyEmailAndUsernamIsAvailable(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const usernameExist = yield userRepository.findOne({ username: request.body.username });
                const emailExist = yield userRepository.findOne({ email: request.body.email });
                if (usernameExist) {
                    throw new Error('username already exist');
                }
                if (emailExist) {
                    throw new Error('email already exist');
                }
                return response.status(200).send('0');
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send('1');
            }
        });
    }
    changePassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                if (request.body.new_password1 !== request.body.new_password2) {
                    throw new Error('password1 and password2 not matched');
                }
                const oldPasswordIsCorrect = yield bcryptjs_1.compare(request.body.old_password, request['user'].password);
                if (!oldPasswordIsCorrect) {
                    throw new Error('old password is wrong');
                }
                let newPass = yield bcryptjs_1.hash(request.body.new_password1, 10);
                yield userRepository.update({ id: request['user'].id }, { password: newPass });
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map