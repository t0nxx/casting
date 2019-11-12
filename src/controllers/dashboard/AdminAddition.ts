import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/newModels/auth_user';

export class AdminAdditionController {
    /**
     * @Get
     */
    async getAllUsers(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            const [data, count] = await userRepository.findAndCount({
                select: ['id', 'isAdmin', 'first_name', 'last_name', 'email', 'username'],
                order: { id: 'DESC' }
            })

            return response.status(200).send({ data, count });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
    * @Get
    */
    async getOneUser(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            const data = await userRepository.findOne({ id: parseInt(request.params.id, 10) }, {
                select: ['id', 'isAdmin', 'first_name', 'last_name', 'email', 'username'],
                order: { id: 'DESC' }
            });
            if (!data) { throw new Error('User not found'); }
            return response.status(200).send({ data });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
   * @Put
   */
    async updateUser(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!user) { throw new Error('User not found'); }
            await userRepository.update({ id: parseInt(request.params.id, 10) }, request.body);
            const data = await userRepository.findOne({ id: parseInt(request.params.id, 10) });
            return response.status(200).send({ data });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    /**
  * @Delete
  */
    async deleteUser(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            const data = await userRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!data) { throw new Error('User not found'); }
            await userRepository.delete({ id: parseInt(request.params.id, 10) });
            return response.status(200).send({ data });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
}