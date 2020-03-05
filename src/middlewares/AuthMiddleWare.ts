import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { JWTSECRET } from '../config/Secrets';
import { User } from '../models/auth_user';
import { ProfileSettings } from '../models/profile_settings';
import { Profile } from '../models/users_profile';


export const AuthMiddleWare = async (req, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const profileRepository = getRepository(Profile);
    const settingsRepository = getRepository(ProfileSettings);
    try {
        if (!req.headers.authorization) { throw new Error('Not Token Provided'); }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) { throw new Error('Not authorized'); }
        const decode: any = await verify(token, JWTSECRET);
        const user = await userRepository.findOne({ id: decode.id });
        if (!user) { throw new Error('Not authorized'); }
        const profile = await profileRepository.findOne({ user });
        if (!profile) { throw new Error('Not authorized'); }
        const updateLatestActivity = await settingsRepository.update({ profile }, { latest_action: new Date() });

        req.user = user; // req.user will not work with ts
        next();
    } catch (error) {
        /**
              * if ther error from class validator , return first object . else message of error
              */
        const err = error[0] ? Object.values(error[0].constraints) : [error.message];
        return res.status(401).send({ success: false, error: err });
    }
}