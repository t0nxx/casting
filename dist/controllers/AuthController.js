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
const bcryptjs_1 = require("bcryptjs");
const class_transformer_validator_1 = require("class-transformer-validator");
const randomString = require("randomstring");
const Secrets_1 = require("../config/Secrets");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_user_1 = require("../models/auth_user");
const GnerateJwt_1 = require("../helpers/GnerateJwt");
const users_profile_1 = require("../models/users_profile");
const profile_settings_1 = require("../models/profile_settings");
const talent_categories_1 = require("../models/talent_categories");
const sendMail_1 = require("../helpers/sendMail");
class AuthController {
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const user = yield userRepository.findOne({ username: request.body.username });
                if (!user) {
                    throw new Error('invalid username / password');
                }
                const checkPass = yield bcryptjs_1.compare(request.body.password, user.password);
                if (!checkPass) {
                    throw new Error('invalid username / password');
                }
                if (user.is_active !== true) {
                    throw new Error('please activate you account first , check your email');
                }
                const data = yield profileRepository.findOne({ slug: request.body.username }, {
                    relations: ['user']
                });
                const { first_name, last_name, email, username } = data.user;
                delete data.user;
                const responseObject = Object.assign(Object.assign({}, data), { isSuperAdmin: user.isAdmin, auth_user: { pk: data.id, first_name, last_name, email, username } });
                const token = yield GnerateJwt_1.generateJwtToken({
                    id: user.id,
                    isSuperAdmin: user.isAdmin,
                });
                return response.status(200).send({ success: true, token, user: Object.assign({}, responseObject) });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    adminLogin(request, response) {
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
                if (user.isAdmin != true) {
                    throw new Error('Not Authorize');
                }
                const token = yield GnerateJwt_1.generateJwtToken({
                    id: user.id,
                    isAdmin: user.isAdmin,
                });
                return response.status(200).send({ token });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(401).send({ error: err });
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
                newProfile.about = request.body.about;
                newProfile.phone = request.body.phone;
                newProfile.birthDate = request.body.birthDate;
                const createProfile = yield profileRepository.save(newProfile);
                const newProfileSettings = new profile_settings_1.ProfileSettings();
                newProfileSettings.profile = createProfile;
                newProfileSettings.response_message = '';
                const crateProfileSettings = yield profileSettingsRepository.save(newProfileSettings);
                const activationLink = `https://api.castingsecret.com/auth/registration/activation/${create.activationCode}`;
                sendMail_1.sendActivationMail(create.email, create.first_name, activationLink);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    LoginWithFacebook(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const usernameExist = yield userRepository.findOne({ social_site_id: request.body.user.id, social_site: 'facebook' });
                if (usernameExist) {
                    const data = yield profileRepository.findOne({ slug: usernameExist.username }, {
                        relations: ['user']
                    });
                    delete data.user;
                    const token = yield GnerateJwt_1.generateJwtToken({
                        id: usernameExist.id,
                        isAdmin: usernameExist.isAdmin,
                    });
                    const { first_name, last_name, id, email, username } = usernameExist;
                    const responseObject = Object.assign(Object.assign({}, data), { auth_user: { pk: id, first_name, last_name, email, username } });
                    return response.status(200).send({ success: true, token, user: Object.assign({}, responseObject) });
                }
                const newUser = new auth_user_1.User();
                newUser.social_site_id = request.body.user.id;
                newUser.email = request.body.user.email;
                newUser.first_name = request.body.user.first_name;
                newUser.last_name = request.body.user.last_name;
                newUser.username = request.body.user.first_name + '-' + randomString.generate({ length: 5 });
                newUser.social_site = 'facebook';
                const DefaultPass = 'casting_dev_pass';
                newUser.password1 = DefaultPass;
                newUser.password2 = DefaultPass;
                newUser.password = yield bcryptjs_1.hash(DefaultPass, 10);
                const create = yield userRepository.save(newUser);
                const newProfile = new users_profile_1.Profile();
                newProfile.slug = create.username;
                newProfile.user = create;
                if (request.body.category) {
                    const categories = yield talentCategoryRepository.findByIds(request.body.category);
                    newProfile.categories = categories;
                }
                if (request.body.user.picture) {
                    newProfile.avatar = request.body.user.picture.data.url;
                }
                const createProfile = yield profileRepository.save(newProfile);
                const newProfileSettings = new profile_settings_1.ProfileSettings();
                newProfileSettings.profile = createProfile;
                const crateProfileSettings = yield profileSettingsRepository.save(newProfileSettings);
                const token = yield GnerateJwt_1.generateJwtToken({
                    id: create.id,
                    isAdmin: create.isAdmin,
                });
                const data = yield profileRepository.findOne({ slug: createProfile.slug }, {
                    relations: ['user']
                });
                delete data.user;
                const { first_name, last_name, id, email, username } = create;
                const responseObject = Object.assign(Object.assign({}, data), { auth_user: { pk: id, first_name, last_name, email, username } });
                return response.status(200).send({ success: true, token, user: Object.assign({}, responseObject) });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    LoginWithGoogle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            const talentCategoryRepository = typeorm_1.getRepository(talent_categories_1.TalentCategories);
            try {
                const usernameExist = yield userRepository.findOne({ social_site_id: request.body.user.id, social_site: 'google' });
                if (usernameExist) {
                    const data = yield profileRepository.findOne({ slug: usernameExist.username }, {
                        relations: ['user']
                    });
                    delete data.user;
                    const token = yield GnerateJwt_1.generateJwtToken({
                        id: usernameExist.id,
                        isAdmin: usernameExist.isAdmin,
                    });
                    const { first_name, last_name, id, email, username } = usernameExist;
                    const responseObject = Object.assign(Object.assign({}, data), { auth_user: { pk: id, first_name, last_name, email, username } });
                    return response.status(200).send({ success: true, token, user: Object.assign({}, responseObject) });
                }
                const newUser = new auth_user_1.User();
                newUser.social_site_id = request.body.user.id;
                newUser.email = request.body.user.email;
                newUser.first_name = request.body.user.given_name;
                newUser.last_name = request.body.user.family_name;
                newUser.username = request.body.user.given_name + '-' + randomString.generate({ length: 5 });
                newUser.social_site = 'google';
                const DefaultPass = 'casting_dev_pass';
                newUser.password1 = DefaultPass;
                newUser.password2 = DefaultPass;
                newUser.password = yield bcryptjs_1.hash(DefaultPass, 10);
                const create = yield userRepository.save(newUser);
                const newProfile = new users_profile_1.Profile();
                newProfile.slug = create.username;
                newProfile.user = create;
                if (request.body.category) {
                    const categories = yield talentCategoryRepository.findByIds(request.body.category);
                    newProfile.categories = categories;
                }
                if (request.body.user.picture) {
                    newProfile.avatar = request.body.user.picture;
                }
                const createProfile = yield profileRepository.save(newProfile);
                const newProfileSettings = new profile_settings_1.ProfileSettings();
                newProfileSettings.profile = createProfile;
                const crateProfileSettings = yield profileSettingsRepository.save(newProfileSettings);
                const token = yield GnerateJwt_1.generateJwtToken({
                    id: create.id,
                    isAdmin: create.isAdmin,
                });
                const data = yield profileRepository.findOne({ slug: createProfile.slug }, {
                    relations: ['user']
                });
                delete data.user;
                const { first_name, last_name, id, email, username } = create;
                const responseObject = Object.assign(Object.assign({}, data), { auth_user: { pk: id, first_name, last_name, email, username } });
                return response.status(200).send({ success: true, token, user: Object.assign({}, responseObject) });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
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
                return response.status(400).send({ msg: error.message });
            }
        });
    }
    verifyToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = request.body.token;
                if (!token) {
                    throw new Error('not token provided');
                }
                const decode = yield jsonwebtoken_1.verify(token, Secrets_1.JWTSECRET);
                if (decode) {
                    return response.status(200).send({ token: token });
                }
                else {
                    throw new Error('not token provided');
                }
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send(err);
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
                return response.status(400).send({ error: err });
            }
        });
    }
    resetPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const isExist = yield userRepository.findOne({ email: request.body.email });
                if (!isExist) {
                    throw new Error('email not register');
                }
                const randomReset = randomString.generate(6);
                isExist.resetPassCode = randomReset;
                yield userRepository.save(isExist);
                sendMail_1.sendResetPasswordMail(isExist.email, randomReset);
                return response.status(200).send({ msg: 'An Email will be sent with code' });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send(err);
            }
        });
    }
    resetPasswordConfirm(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                if (request.body.new_password1 !== request.body.new_password2) {
                    throw new Error('password1 and password2 not matched');
                }
                const user = yield userRepository.findOne({ email: request.body.email });
                if (user.resetPassCode !== request.body.resetPassCode) {
                    throw new Error('invalid reset code');
                }
                let newPass = yield bcryptjs_1.hash(request.body.new_password1, 10);
                yield userRepository.update({ email: request.body.email }, { password: newPass });
                return response.status(200).send({ msg: 'password reset is done' });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send(err);
            }
        });
    }
    activateAccount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const isExist = yield userRepository.findOne({ activationCode: request.params.token });
                if (!isExist) {
                    throw new Error('email not found');
                }
                isExist.is_active = true;
                yield userRepository.save(isExist);
                return response.redirect('https://castingsecret.com/account/login');
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send(err);
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map