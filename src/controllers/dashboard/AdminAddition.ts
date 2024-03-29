import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/auth_user';
import { ActivityReports } from '../../models/activity_reports';
import { Activity } from '../../models/activity';

class AdminAdditionController {
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
                .innerJoin('u.profiles', 'profile')
                .select(['u.id', 'u.isAdmin', 'u.is_active', 'u.first_name', 'u.last_name', 'u.email', 'u.username', 'profile.phone'])
                .orderBy('u.id', 'DESC');
            if (request.query.query) {
                q.andWhere(`u.first_name like '%${request.query.query}%' or u.last_name like '%${request.query.query}%' or u.username like '%${request.query.query}%' or u.email like '%${request.query.query}%'`);
            }

            const [data, count] = await q.getManyAndCount();

            const formatedRes = data.map(e => {
                const { phone } = e.profiles[0];
                delete e.profiles;
                return { ...e, phone }
            });


            return response.status(200).send({ data: formatedRes, count });
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
            const data = await userRepository.createQueryBuilder('u')
                .innerJoin('u.profiles', 'profile')
                .select(['u.id', 'u.isAdmin', 'u.is_active', 'u.first_name', 'u.last_name', 'u.email', 'u.username', 'profile.phone'])
                .where(`u.id = ${parseInt(request.params.id, 10)}`)
                .getOne();

            if (!data) { throw new Error('User not found'); }

            const { profiles, ...rest } = data;

            return response.status(200).send({ data: { ...rest, phone: profiles[0].phone } });
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
            // temp solution remove phone from body
            delete request.body.phone;

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
export const adminAdditionController = new AdminAdditionController();
