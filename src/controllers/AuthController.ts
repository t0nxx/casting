import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { transformAndValidate } from 'class-transformer-validator';
import { JWTSECRET } from '../config/Secrets';
import { verify } from 'jsonwebtoken';
import { User } from '../models/newModels/auth_user';
import { generateJwtToken } from '../helpers/GnerateJwt';
import { Profile } from '../models/newModels/users_profile';
import { ProfileSettings } from '../models/newModels/profile_settings';
import { TalentCategories } from '../models/newModels/talent_categories';

export class AuthController {

    /**
     * @Post
     */
    async login(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOne({ username: request.body.username }, {
                // relations: ['']
            });
            if (!user) { throw new Error('invalid username / password'); }
            const checkPass = await compare(request.body.password, user.password);
            if (!checkPass) { throw new Error('invalid username / password'); }

            const token = await generateJwtToken({
                id: user.id,
                isAdmin: user.isAdmin,
            });
            return response.status(200).send({ success: true, token, user: { slug: user.username } });
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
            return response.status(200).send({ success: true, token, user: { slug: create.username } });
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
            return response.status(400).send('1');
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
            return response.status(200).send({ token });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send('1');
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
}