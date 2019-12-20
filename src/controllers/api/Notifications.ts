import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Notification } from '../../models/newModels/notify_notification';
import { transformAndValidate } from 'class-transformer-validator';


export class NotificationsController {

    /**
    * @Get All
    */

    async getAllNotifications(request: Request, response: Response, next: NextFunction) {

        const NotificationRepository = getRepository(Notification);
        try {
            // const data = await NotificationRepository.find();
            const data = {
                results: [
                    {
                        id: 1,
                        read: false,
                        created: new Date(),
                        verb: 'حمادة علق على منشورك',
                        target_url: 130,
                        // target_url: 'http://castingsecret.com:3000/job/job-dashboard/sdsdfdsf-jxlva/new-raqCY',
                        actor: {
                            first_name: 'first name ',
                            last_name: 'last name ',
                            avatar: 'https://casting-secret.s3.eu-central-1.amazonaws.com/images/1575804506035%20-%20nobodycare.jpg'
                        }
                    },
                    {
                        id: 2,
                        read: false,
                        created: new Date(),
                        verb: 'حمادة اعجب ب  منشورك',
                        target_url: 87,
                        // target_url: 'http://castingsecret.com:3000/job/job-dashboard/sdsdfdsf-jxlva/new-raqCY',
                        actor: {
                            first_name: 'first name ',
                            last_name: 'last name ',
                            avatar: 'https://casting-secret.s3.eu-central-1.amazonaws.com/images/1575804506035%20-%20nobodycare.jpg'
                        }
                    },
                    {
                        id: 3,
                        read: true,
                        created: new Date(),
                        verb: 'حمادة علق على منشورك',
                        target_url: 84,
                        // target_url: 'http://castingsecret.com:3000/job/job-dashboard/sdsdfdsf-jxlva/new-raqCY',
                        actor: {
                            first_name: 'first name of notifier',
                            last_name: 'last name of notifer',
                            avatar: 'https://casting-secret.s3.eu-central-1.amazonaws.com/images/1575804506035%20-%20nobodycare.jpg'
                        }
                    },
                    {
                        id: 3,
                        read: true,
                        created: new Date(),
                        verb: 'عندك انترفيو يوم التلات بعد صلاة الجمعة : 3',
                        target_url: 130,
                        // target_url: 'http://castingsecret.com:3000/job/job-dashboard/sdsdfdsf-jxlva/new-raqCY',
                        actor: {
                            first_name: 'first name of notifier',
                            last_name: 'last name of notifer',
                        }
                    }
                ],
                count: 3
            }
            return response.status(200).send(data);
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