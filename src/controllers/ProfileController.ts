import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { users_profile } from '../models/users_profile';

export class ProfileController {

    /**
    * @Get All
    */

    async all(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(users_profile);
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

    async one(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(users_profile);
        try {
            const data = await profileRepository.findOne({ slug: request.params.slug });
            if (!data) { throw new Error('profile Not Found'); }
            response.status(200).send({ error: false, data: { data } });
        } catch (error) {
            response.status(400).send({ error: true, data: error.message });
        }
    }

    async settings(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(users_profile);
        try {
            const data = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['profileSettingss'] });
            if (!data) { throw new Error('profile Not Found'); }
            response.status(200).send(data.profileSettingss[0]);
        } catch (error) {
            response.status(400).send({ error: true, data: error.message });
        }
    }

    async companies(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(users_profile);
        try {
            const data = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['companys'] });
            if (!data) { throw new Error('profile Not Found'); }
            response.status(200).send({ error: false, data: { data } });
        } catch (error) {
            response.status(400).send({ error: true, data: error.message });
        }
    }

    async album(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(users_profile);
        try {
            const data = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['profileAlbums'] });
            if (!data) { throw new Error('profile Not Found'); }
            response.status(200).send({ error: false, data: { data } });
        } catch (error) {
            response.status(400).send({ error: true, data: error.message });
        }
    }

    /**
    * @Add One
    */

    async add(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(users_profile);
        try {
            const data = await profileRepository.save(request.body);
            response.status(200).send({ error: false, data: { data } });
        } catch (error) {
            response.status(400).send({ error: true, data: error.message });
        }
    }

    /**
    * @Delete One
    */

    async remove(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(users_profile);
        try {
            const profileToRemove = await profileRepository.findOne(request.params.id);
            const data = await profileRepository.remove(profileToRemove);
            response.status(200).send({ error: false, data: { data } });
        } catch (error) {
            response.status(400).send({ error: true, data: error.message });
        }
    }

}
