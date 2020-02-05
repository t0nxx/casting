import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/newModels/auth_user';
import { ActivityReports } from '../../models/newModels/activity_reports';
import { Activity } from '../../models/newModels/activity';

export class AdminAdditionController {
    /**
     * @Get
     */
    async getAllUsers(request: Request, response: Response) {
        const userRepository = getRepository(User);
        try {
            // const [data, count] = await userRepository.findAndCount({
            //     select: ['id', 'isAdmin', 'first_name', 'last_name', 'email', 'username'],
            //     order: { id: 'DESC' }
            // });
            const q = await userRepository.createQueryBuilder('u')
                .select(['u.id', 'u.isAdmin', 'u.first_name', 'u.last_name', 'u.email', 'u.username'])
                .orderBy('u.id', 'DESC');
            if (request.query.query) {
                q.andWhere(`u.first_name like '%${request.query.query}%' or u.last_name like '%${request.query.query}%' or u.username like '%${request.query.query}%' or u.email like '%${request.query.query}%'`);
            }

            const [data, count] = await q.getManyAndCount();

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

    /**
    * @Get
    */
    async getActivityReports(request: Request, response: Response) {
        const activityReportsRepository = getRepository(ActivityReports);
        try {
            const [data, count] = await activityReportsRepository.findAndCount({
                relations: ['activity'],
                order: { id: 'DESC' },
                select: ['id', 'reason', 'activity']
                // order: { id: 'DESC' },
                // select: ['id', 'reason', 'activity.id']
            });
            const newData = data.map(e => {
                return {
                    id: e.id,
                    reason: e.reason,
                    link: `https://castingsecret.com/activity/${e.activity.id}`
                }
            })
            return response.status(200).send({ data: newData, count });
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
    async deleteReportedActivityFromAdmin(request: Request, response: Response) {
        const activityReportsRepository = getRepository(ActivityReports);
        const activityRepository = getRepository(Activity);
        try {
            const report = await activityReportsRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['activity'] });
            if (!report) { throw new Error('report not found '); }
            const allReportsOfPost = await activityReportsRepository.find({ activity: report.activity });
            const deleteAllreportsOfActivity = await activityReportsRepository
                .remove(allReportsOfPost);

            await activityRepository.remove(report.activity);
            return response.status(200).send({ data: report });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
}