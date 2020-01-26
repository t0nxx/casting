import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { NewsLetter } from '../../models/newModels/news_letter';
import { transformAndValidate } from 'class-transformer-validator';
import { sendInviteMail } from '../../helpers/sendMail';


export class NewsLetterController {

    /**
    * @Get All
    */

    async getAllNewsLetterUsers(request: Request, response: Response, next: NextFunction) {

        const newsLetterRepository = getRepository(NewsLetter);
        try {
            const data = await newsLetterRepository.find();
            return response.status(200).send(data);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }

    /**
     * 
     * @Post
     */
    async subscribeToNewsLetter(request: Request, response: Response, next: NextFunction) {

        const newsLetterRepository = getRepository(NewsLetter);
        try {
            const validateBody = await transformAndValidate(NewsLetter, request.body);


            const isExist = await newsLetterRepository.findOne({ email: request.body.email });
            if (isExist) { throw new Error('email is already subscribed'); }

            const newSub = new NewsLetter();

            Object.assign(newSub, validateBody);
            const data = await newsLetterRepository.save(newSub);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }

    /**
     * 
     * @Post
     */
    async inviteToCasting(request: Request, response: Response, next: NextFunction) {

        try {
            if (!request.body.email) { throw new Error('email is required'); }

            /**
             * 
             * 
             * send mail logic 
             */
            sendInviteMail(request.body.email);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }
}