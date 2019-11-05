import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { transformAndValidate } from 'class-transformer-validator';
import * as randomString from 'randomstring';
import { JWTSECRET } from '../config/Secrets';
import { verify } from 'jsonwebtoken';
import { User } from '../models/newModels/auth_user';
import { generateJwtToken } from '../helpers/GnerateJwt';
import { Profile } from '../models/newModels/users_profile';
import { ProfileSettings } from '../models/newModels/profile_settings';
import { TalentCategories } from '../models/newModels/talent_categories';
import { sendMail } from '../helpers/sendMail';

export class AuthController {

    /**
     * @Post
     */
    async login(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const profileRepository = getRepository(Profile);
        try {
            const user = await userRepository.findOne({ username: request.body.username });
            if (!user) { throw new Error('invalid username / password'); }
            const checkPass = await compare(request.body.password, user.password);
            if (!checkPass) { throw new Error('invalid username / password'); }

            const data = await profileRepository.findOne({ slug: request.body.username }, {
                relations: ['user']
            });
            const { first_name, last_name, email, username, id } = data.user;
            delete data.user;
            const responseObject = { ...data, auth_user: { pk: id, first_name, last_name, email, username } }
            const token = await generateJwtToken({
                id: user.id,
                isAdmin: user.isAdmin,
            });
            return response.status(200).send({ success: true, token, user: { ...responseObject } });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
   * @Post
   */
    async adminLogin(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOne({ username: request.body.username }, {
                // relations: ['']
            });
            if (!user) { throw new Error('invalid username / password'); }
            const checkPass = await compare(request.body.password, user.password);
            if (!checkPass) { throw new Error('invalid username / password'); }
            if (user.isAdmin != true) { throw new Error('Not Authorize'); }
            const token = await generateJwtToken({
                id: user.id,
                isAdmin: user.isAdmin,
            });
            return response.status(200).send({ token });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(401).send({ success: false, error: err });
        }
    }

    /**
     * @Post
     */

    async signUp(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const profileRepository = getRepository(Profile);
        const profileSettingsRepository = getRepository(ProfileSettings);
        const talentCategoryRepository = getRepository(TalentCategories);
        try {
            const validateBody = await transformAndValidate(User, request.body);
            /* start business logic validation */
            if (request.body.password1 !== request.body.password2) {
                throw new Error('password1 and password2 not matched');
            }
            const usernameExist = await userRepository.findOne({ username: request.body.username });
            const emailExist = await userRepository.findOne({ email: request.body.email });

            if (usernameExist) { throw new Error('username already exist'); }
            if (emailExist) { throw new Error('email already exist'); }
            /* business logic validation */
            const newUser = new User();
            Object.assign(newUser, validateBody);
            newUser.password = await hash(request.body.password1, 10);
            const create = await userRepository.save(newUser);
            // get profile categories 
            const categories = await talentCategoryRepository.findByIds(request.body.category);
            // start create profile for the new user
            const newProfile = new Profile();
            newProfile.slug = create.username;
            newProfile.user = create;
            newProfile.categories = categories;
            newProfile.about = request.body.about;
            const createProfile = await profileRepository.save(newProfile);
            // end create profile for the new user
            // start create settings for the new user
            const newProfileSettings = new ProfileSettings();
            newProfileSettings.profile = createProfile;
            const crateProfileSettings = await profileSettingsRepository.save(newProfileSettings);
            // start create settings for the new user
            const token = await generateJwtToken({
                id: create.id,
                isAdmin: create.isAdmin,
            });
            const data = await profileRepository.findOne({ slug: createProfile.slug }, {
                relations: ['user']
            });
            delete data.user;
            const { first_name, last_name, id, email, username } = create;
            const responseObject = { ...data, auth_user: { pk: id, first_name, last_name, email, username } }
            return response.status(200).send({ success: true, token, user: { ...responseObject } });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
     * @Post 
     */

    async verifyEmailAndUsernamIsAvailable(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            const usernameExist = await userRepository.findOne({ username: request.body.username });
            const emailExist = await userRepository.findOne({ email: request.body.email });

            if (usernameExist) { throw new Error('username already exist'); }
            if (emailExist) { throw new Error('email already exist'); }
            return response.status(200).send('0');
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ msg: error.message });
        }
    }

    /**
     * @Post 
     */

    async verifyToken(request: Request, response: Response) {
        try {
            const token = request.body.token;
            if (!token) { throw new Error('not token provided'); }
            const decode: any = await verify(token, JWTSECRET);
            if (decode) {
                return response.status(200).send({ token: token });
            } else {
                throw new Error('not token provided');
            }
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send(err);
        }
    }

    /**
     * @Post
     */
    async changePassword(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            if (request.body.new_password1 !== request.body.new_password2) {
                throw new Error('password1 and password2 not matched');
            }
            const oldPasswordIsCorrect = await compare(request.body.old_password, request['user'].password);
            if (!oldPasswordIsCorrect) { throw new Error('old password is wrong'); }
            let newPass = await hash(request.body.new_password1, 10);
            await userRepository.update({ id: request['user'].id }, { password: newPass });
            return response.status(200).send({ success: true });
        } catch (error) {
            /**
            * if ther error from class validator , return first object . else message of error
            */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    /**
    * @Post 
    */

    async resetPassword(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            const isExist = await userRepository.findOne({ email: request.body.email });
            if (!isExist) { throw new Error('email not register'); }
            const randomReset = randomString.generate(6);
            isExist.resetPassCode = randomReset;
            await userRepository.save(isExist);
            /**
             * mail service here
             */
            sendMail(isExist.email, randomReset);
            return response.status(200).send({ msg: 'An Email will be sent with code' });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send(err);
        }
    }

    /**
    * @Post 
    */

    async resetPasswordConfirm(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            if (request.body.new_password1 !== request.body.new_password2) {
                throw new Error('password1 and password2 not matched');
            }
            const user = await userRepository.findOne({ email: request.body.email })
            if (user.resetPassCode !== request.body.resetPassCode) {
                throw new Error('invalid reset code');
            }

            let newPass = await hash(request.body.new_password1, 10);
            await userRepository.update({ email: request.body.email }, { password: newPass });
            return response.status(200).send({ msg: 'password reset is done' });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send(err);
        }
    }
}