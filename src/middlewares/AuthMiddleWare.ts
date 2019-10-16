import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { JWTSECRET } from '../config/Secrets';
import { User } from '../models/newModels/auth_user';


export const AuthMiddleWare = async (req, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    try {
        const token = req.headers.authorization;
        if (!token) { throw new Error('Not authorized'); }
        const decode: any = await verify(token, JWTSECRET);
        const user = await userRepository.findOne({ id: decode.id });
        if (!user) { throw new Error('Not authorized'); }
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