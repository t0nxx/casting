import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/auth_user';
import { Advertisement } from '../../models/ads';
import { UploadToS3 } from '../../helpers/awsUploader';

export class AdvertisementController {

    async getAllAdvertisement(request: Request, response: Response, next: NextFunction) {
        try {
            const advertisementRepository = getRepository(Advertisement);
            const [data, count] = await advertisementRepository.findAndCount({ order: { id: 'DESC', vip: 'DESC' } });
            return response.status(200).send({ data, count });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async getOneAdvertisement(request: Request, response: Response, next: NextFunction) {
        try {

            const advertisementRepository = getRepository(Advertisement);
            const data = await advertisementRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!data) { throw new Error('given id not found'); }
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async createNewAdvertisement(request: Request, response: Response, next: NextFunction) {
        try {
            console.log(request.body);
            const item = new Advertisement();
            item.name = request.body.name || '';
            item.vip = request.body.vip && request.body.vip === 'true' ? true : false;
            item.path = await UploadToS3(request.files.file, 'image');

            const advertisementRepository = getRepository(Advertisement);


            const data = await advertisementRepository.save(item);
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async updateOneAdvertisement(request: Request, response: Response, next: NextFunction) {
        try {
            const advertisementRepository = getRepository(Advertisement);
            const find = await advertisementRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!find) { throw new Error('given id not found'); }

            if (request.files && request.files.file) {
                request.body.path = await UploadToS3(request.files.file, 'image');
                delete request.body.file;
            }
            request.body.vip = request.body.vip && request.body.vip === 'true' ? true : false;

            await advertisementRepository.update({ id: parseInt(request.params.id, 10) }, request.body)
            const data = await advertisementRepository.findOne({ id: parseInt(request.params.id, 10) });
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async deleteOneAdvertisement(request: Request, response: Response, next: NextFunction) {
        try {

            const advertisementRepository = getRepository(Advertisement);
            const find = await advertisementRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!find) { throw new Error('given id not found'); }
            await advertisementRepository.delete({ id: parseInt(request.params.id, 10) })
            return response.status(200).send({ data: find });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

}