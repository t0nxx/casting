import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/auth_user';
import { Jobs } from '../../models/jobs';
import { UploadToS3 } from '../../helpers/awsUploader';

export class AdminJobsController {

    async getAllJobs(request: Request, response: Response, next: NextFunction) {
        try {
            const JobsRepository = getRepository(Jobs);
            const [data, count] = await JobsRepository.findAndCount({order : {id : 'DESC'}});
            return response.status(200).send({ data, count });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async getOneJobs(request: Request, response: Response, next: NextFunction) {
        try {

            const JobsRepository = getRepository(Jobs);
            const data = await JobsRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!data) { throw new Error('given id not found'); }
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    // async createNewJobs(request: Request, response: Response, next: NextFunction) {
    //     try {
    //         console.log(request.body);
    //         const item = new Jobs();
    //         item.name = request.body.name || '';
    //         item.vip = request.body.vip && request.body.vip === 'true' ? true : false;
    //         item.path = await UploadToS3(request.files.file, 'image');

    //         const JobsRepository = getRepository(Jobs);


    //         const data = await JobsRepository.save(item);
    //         return response.status(200).send({ data });
    //     } catch (error) {
    //         const err = error[0] ? Object.values(error[0].constraints) : [error.message];
    //         return response.status(400).send({ success: false, error: err });
    //     }
    // }
    // async updateOneJobs(request: Request, response: Response, next: NextFunction) {
    //     try {
    //         const JobsRepository = getRepository(Jobs);
    //         const find = await JobsRepository.findOne({ id: parseInt(request.params.id, 10) });
    //         if (!find) { throw new Error('given id not found'); }

    //         if (request.files && request.files.file) {
    //             request.body.path = await UploadToS3(request.files.file, 'image');
    //             delete request.body.file;
    //         }
    //         request.body.vip = request.body.vip && request.body.vip === 'true' ? true : false;

    //         await JobsRepository.update({ id: parseInt(request.params.id, 10) }, request.body)
    //         const data = await JobsRepository.findOne({ id: parseInt(request.params.id, 10) });
    //         return response.status(200).send({ data });
    //     } catch (error) {
    //         const err = error[0] ? Object.values(error[0].constraints) : [error.message];
    //         return response.status(400).send({ success: false, error: err });
    //     }
    // }
    async deleteOneJobs(request: Request, response: Response, next: NextFunction) {
        try {

            const JobsRepository = getRepository(Jobs);
            const find = await JobsRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!find) { throw new Error('given id not found'); }
            await JobsRepository.delete({ id: parseInt(request.params.id, 10) })
            return response.status(200).send({ data: find });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

}