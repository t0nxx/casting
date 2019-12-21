import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Notification } from '../../models/newModels/notify_notification';
import { Profile } from '../../models/newModels/users_profile';
import { transformAndValidate } from 'class-transformer-validator';
import { ApplyPagination } from '../../helpers/pagination';


export class NotificationsController {

    /**
    * @Get All
    */

    async getAllNotifications(request: Request, response: Response, next: NextFunction) {

        const NotificationRepository = getRepository(Notification);
        const profileRepository = getRepository(Profile);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const q = NotificationRepository.createQueryBuilder('n')
                .where(`n.recipientId = ${profile.id}`)
                .orderBy('n.id', 'DESC');

            if (request.query.month) {
                q.andWhere(`month(n.created) = ${request.query.month} and year(n.created) = ${request.query.year}`)
            }

            const responseObject = await ApplyPagination(request, response, q, false);

            return response.status(200).send(responseObject);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }

    /**
    * @Get new
    */

    async getCountOfNewAndNotRead(request: Request, response: Response, next: NextFunction) {

        const NotificationRepository = getRepository(Notification);
        const profileRepository = getRepository(Profile);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const count = await NotificationRepository.count({ recipient: profile, read: false });

            return response.status(200).send({ count });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }
    /**
    * @Post
    */

    async makeNotificationRead(request: Request, response: Response, next: NextFunction) {

        const NotificationRepository = getRepository(Notification);
        try {
            const noti = await NotificationRepository.findOne({ id: parseInt(request.params.id, 10) });

            if (!noti) { throw new Error('notification not found'); }

            noti.read = true;
            await NotificationRepository.save(noti);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }

    // /**
    //  * 
    //  * @Post
    //  */
    // async subscribeToNewsLetter(request: Request, response: Response, next: NextFunction) {

    //     const newsLetterRepository = getRepository(NewsLetter);
    //     try {
    //         const validateBody = await transformAndValidate(NewsLetter, request.body);


    //         const isExist = await newsLetterRepository.findOne({ email: request.body.email });
    //         if (isExist) { throw new Error('email is already subscribed'); }

    //         const newSub = new NewsLetter();

    //         Object.assign(newSub, validateBody);
    //         const data = await newsLetterRepository.save(newSub);

    //         return response.status(200).send({ success: true });
    //     } catch (error) {
    //         const err = error[0] ? Object.values(error[0].constraints) : [error.message];
    //         return response.status(400).send({ success: false, error: err });
    //     }

    // }
}