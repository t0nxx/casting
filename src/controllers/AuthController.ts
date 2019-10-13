import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { transformAndValidate } from 'class-transformer-validator';
import { User } from '../models/newModels/auth_user';
import { generateJwtToken } from '../helpers/GnerateJwt';

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
            response.status(200).send({ success: true, token, user: { slug: user.username } });
        } catch (error) {
            response.status(400).send({ success: false, error });
        }
    }

    /**
     * @Post
     */

    async signUp(request: Request, response: Response) {
        const userRepository = getRepository(User);
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
            const token = await generateJwtToken({
                id: create.id,
                isAdmin: create.isAdmin,
            });
            response.status(200).send({ success: true, token, user: { slug: create.username } });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            response.status(400).send({ success: false, error: err });
        }
    }
}