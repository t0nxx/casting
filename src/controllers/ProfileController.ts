import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Profile } from '../models/newModels/users_profile'

export class ProfileController {

    /**
    * @Get All
    */

    async all(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        try {
            const data = await profileRepository.find();
            response.status(200).send({ error: false, data: { data } });
        } catch (error) {
            response.status(400).send({ error: true, data: error.message });
        }

    }

    /**
    * @Get One
    */

    async getProfile(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        try {
            const data = await profileRepository.findOne({ slug: request.params.slug });
            if (!data) { throw new Error('profile Not Found'); }
            return response.status(200).send({ success: true, ...data });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }


    /**
     * @Patch
     */

    async updateProfile(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        try {
            // username is the slug here 
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            await profileRepository.update({ id: profile.id }, request.body);
            const afterUpdate = await profileRepository.findOne({ id: profile.id });
            return response.status(200).send({ success: true, ...afterUpdate });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    // async settings(request: Request, response: Response, next: NextFunction) {

    //     const profileRepository = getRepository(Profile);
    //     try {
    //         const data = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['profileSettingss'] });
    //         if (!data) { throw new Error('profile Not Found'); }
    //         response.status(200).send(data.profileSettingss[0]);
    //     } catch (error) {
    //         response.status(400).send({ error: true, data: error.message });
    //     }
    // }

    // async companies(request: Request, response: Response, next: NextFunction) {

    //     const profileRepository = getRepository(users_profile);
    //     try {
    //         const data = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['companys'] });
    //         if (!data) { throw new Error('profile Not Found'); }
    //         response.status(200).send({ error: false, data: { data } });
    //     } catch (error) {
    //         response.status(400).send({ error: true, data: error.message });
    //     }
    // }

    // async album(request: Request, response: Response, next: NextFunction) {

    //     const profileRepository = getRepository(Profile);
    //     try {
    //         const data = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['profileAlbums'] });
    //         if (!data) { throw new Error('profile Not Found'); }
    //         response.status(200).send({ error: false, data: { data } });
    //     } catch (error) {
    //         response.status(400).send({ error: true, data: error.message });
    //     }
    // }

    /**
    * @Add One
    */

    // async add(request: Request, response: Response, next: NextFunction) {

    //     const profileRepository = getRepository(users_profile);
    //     try {
    //         const data = await profileRepository.save(request.body);
    //         response.status(200).send({ error: false, data: { data } });
    //     } catch (error) {
    //         response.status(400).send({ error: true, data: error.message });
    //     }
    // }

    /**
    * @Delete One
    */

    // async remove(request: Request, response: Response, next: NextFunction) {

    //     const profileRepository = getRepository(users_profile);
    //     try {
    //         const profileToRemove = await profileRepository.findOne(request.params.id);
    //         const data = await profileRepository.remove(profileToRemove);
    //         response.status(200).send({ error: false, data: { data } });
    //     } catch (error) {
    //         response.status(400).send({ error: true, data: error.message });
    //     }
    // }

}
