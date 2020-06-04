import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/auth_user';
import { Company } from '../../models/company';
import { UploadToS3 } from '../../helpers/awsUploader';

export class AdminCompaniesController {

    async getAllCompanies(request: Request, response: Response, next: NextFunction) {
        try {
            const CompaniesRepository = getRepository(Company);
            const [data, count] = await CompaniesRepository.findAndCount();
            return response.status(200).send({ data, count });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async getOneCompanies(request: Request, response: Response, next: NextFunction) {
        try {

            const CompaniesRepository = getRepository(Company);
            const data = await CompaniesRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!data) { throw new Error('given id not found'); }
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    // async createNewCompanies(request: Request, response: Response, next: NextFunction) {
    //     try {
    //         console.log(request.body);
    //         const item = new Companies();
    //         item.name = request.body.name || '';
    //         item.vip = request.body.vip && request.body.vip === 'true' ? true : false;
    //         item.path = await UploadToS3(request.files.file, 'image');

    //         const CompaniesRepository = getRepository(Company);


    //         const data = await CompaniesRepository.save(item);
    //         return response.status(200).send({ data });
    //     } catch (error) {
    //         const err = error[0] ? Object.values(error[0].constraints) : [error.message];
    //         return response.status(400).send({ success: false, error: err });
    //     }
    // }
    // async updateOneCompanies(request: Request, response: Response, next: NextFunction) {
    //     try {
    //         const CompaniesRepository = getRepository(Companies);
    //         const find = await CompaniesRepository.findOne({ id: parseInt(request.params.id, 10) });
    //         if (!find) { throw new Error('given id not found'); }

    //         if (request.files && request.files.file) {
    //             request.body.path = await UploadToS3(request.files.file, 'image');
    //             delete request.body.file;
    //         }
    //         request.body.vip = request.body.vip && request.body.vip === 'true' ? true : false;

    //         await CompaniesRepository.update({ id: parseInt(request.params.id, 10) }, request.body)
    //         const data = await CompaniesRepository.findOne({ id: parseInt(request.params.id, 10) });
    //         return response.status(200).send({ data });
    //     } catch (error) {
    //         const err = error[0] ? Object.values(error[0].constraints) : [error.message];
    //         return response.status(400).send({ success: false, error: err });
    //     }
    // }
    async deleteOneCompanies(request: Request, response: Response, next: NextFunction) {
        try {

            const CompaniesRepository = getRepository(Company);
            const find = await CompaniesRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!find) { throw new Error('given id not found'); }
            await CompaniesRepository.delete({ id: parseInt(request.params.id, 10) })
            return response.status(200).send({ data: find });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

}