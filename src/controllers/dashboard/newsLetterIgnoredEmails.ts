import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/auth_user';
import { IgnoredMailsFromNewsletter } from '../../models/ignored_users_from_newsletter';
import { UploadToS3 } from '../../helpers/awsUploader';

class IgnoredEmailsFromNewsletterController {

    async getAllIgnoredEmailsFromNewsletter(request: Request, response: Response, next: NextFunction) {
        try {
            const IgnoredEmailsFromNewsletterRepository = getRepository(IgnoredMailsFromNewsletter);
            const [data, count] = await IgnoredEmailsFromNewsletterRepository.findAndCount();
            return response.status(200).send({ data, count });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async getOneIgnoredEmailsFromNewsletter(request: Request, response: Response, next: NextFunction) {
        try {

            const IgnoredEmailsFromNewsletterRepository = getRepository(IgnoredMailsFromNewsletter);
            const data = await IgnoredEmailsFromNewsletterRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!data) { throw new Error('given id not found'); }
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async createNewIgnoredEmailsFromNewsletter(request: Request, response: Response, next: NextFunction) {
        try {
            const IgnoredEmailsFromNewsletterRepository = getRepository(IgnoredMailsFromNewsletter);

            if (!request.body.email) { throw new Error('no email sent'); }

            const isExist = await IgnoredEmailsFromNewsletterRepository.findOne({ email: request.body.email })

            if (isExist) {
                return response.status(200).send({ data: isExist });

            }

            const item = new IgnoredMailsFromNewsletter();
            item.email = request.body.email;

            const data = await IgnoredEmailsFromNewsletterRepository.save(item);
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async updateOneIgnoredEmailsFromNewsletter(request: Request, response: Response, next: NextFunction) {
        try {
            const IgnoredEmailsFromNewsletterRepository = getRepository(IgnoredMailsFromNewsletter);
            const find = await IgnoredEmailsFromNewsletterRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!find) { throw new Error('given id not found'); }
            await IgnoredEmailsFromNewsletterRepository.update({ id: parseInt(request.params.id, 10) }, request.body)
            const data = await IgnoredEmailsFromNewsletterRepository.findOne({ id: parseInt(request.params.id, 10) });
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async deleteOneIgnoredEmailsFromNewsletter(request: Request, response: Response, next: NextFunction) {
        try {

            const IgnoredEmailsFromNewsletterRepository = getRepository(IgnoredMailsFromNewsletter);
            const find = await IgnoredEmailsFromNewsletterRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!find) { throw new Error('given id not found'); }
            await IgnoredEmailsFromNewsletterRepository.delete({ id: parseInt(request.params.id, 10) })
            return response.status(200).send({ data: find });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

}
export const ignoredEmailsFromNewsletterController = new IgnoredEmailsFromNewsletterController();
