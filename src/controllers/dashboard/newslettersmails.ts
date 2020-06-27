import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/auth_user';
import { NewsLetterMailTemplate } from '../../models/mail_template';
import { IgnoredMailsFromNewsletter } from '../../models/ignored_users_from_newsletter';
import { sendMailWithCustomHtmlTemplate } from '../../helpers/sendMail';
import * as _ from 'underscore';
import { sendEmailsQueue } from '../../main';
import { EmailsToSendType, EmailQueueInterface } from '../../jobs/SendEmails'


class AdminSendMailsController {

    async saveHtmlMailTemplate(request: Request, response: Response, next: NextFunction) {
        try {
            const mailTemplateRepository = getRepository(NewsLetterMailTemplate);
            const template = await mailTemplateRepository.findOne({ id: 1 });

            if (!template) { throw new Error('given id not found'); }

            // console.log(JSON.stringify(request.body.content));
            if (!request.body.content) {
                throw new Error('no content sent');
            }
            template.body = JSON.stringify(request.body.content);
            const newTemp = await mailTemplateRepository.save(template);
            return response.status(200).send({ data: newTemp });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async getHtmlMailTemplate(request: Request, response: Response, next: NextFunction) {
        try {

            const mailTemplateRepository = getRepository(NewsLetterMailTemplate);
            const data = await mailTemplateRepository.findOne({ id: 1 });
            if (!data) { throw new Error('given id not found'); }
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async sendNewsLetterMail(request: Request, response: Response, next: NextFunction) {
        try {
            const userRepository = getRepository(User);
            const ignoredUsersFromSendRepository = getRepository(IgnoredMailsFromNewsletter);
            const mailHtmlBody = request.body.content;
            if (!mailHtmlBody) {
                throw new Error('no mail body sent');
            }
            // console.log(mailHtmlBody);
            const users = (await userRepository.find({ select: ['email'] })).map(e => e.email)
            const ignoredUsersFromSend = await (await ignoredUsersFromSendRepository.find({ select: ['email'] })).map(e => e.email)

            const usersToSent = _.difference(users, ignoredUsersFromSend);
            // const usersToSent = ['mahmoudko1500@hotmail.com', 'hhaker95@gmail.com'];
            /**
             * send mail function here
             */
            // const chunkEmailsToReduceMailProviderRateLimit = _.chunk(usersToSent, 90);

            const newEmailToSend: EmailQueueInterface = {
                type: EmailsToSendType.NewsLetter,
                recipients: usersToSent,
                htmlTemplate: mailHtmlBody,
            }
            // the mail provider , has limit 100 mail/hour , so i'll delay each 90 mail to be sent in every hour
            // 1000 millisec * 60 sec * 60 min ==== hour  * index , ex , first array delayed 1 hour , the secound 2 ....son on
            await sendEmailsQueue.add(newEmailToSend);

            // sendMailWithCustomHtmlTemplate(['mahmoudko1500@hotmail.com','hhacker95@gmail.com'],mailHtmlBody);

            return response.status(200).send({ success: true });
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


}
export const adminSendMailsController = new AdminSendMailsController();