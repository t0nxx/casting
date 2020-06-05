"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const auth_user_1 = require("../../models/auth_user");
const activity_reports_1 = require("../../models/activity_reports");
const activity_1 = require("../../models/activity");
class AdminAdditionController {
    getAllUsers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const q = yield userRepository.createQueryBuilder('u')
                    .select(['u.id', 'u.isAdmin', 'u.is_active', 'u.first_name', 'u.last_name', 'u.email', 'u.username'])
                    .orderBy('u.id', 'DESC');
                if (request.query.query) {
                    q.andWhere(`u.first_name like '%${request.query.query}%' or u.last_name like '%${request.query.query}%' or u.username like '%${request.query.query}%' or u.email like '%${request.query.query}%'`);
                }
                const [data, count] = yield q.getManyAndCount();
                return response.status(200).send({ data, count });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getOneUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const data = yield userRepository.findOne({ id: parseInt(request.params.id, 10) }, {
                    select: ['id', 'isAdmin', 'is_active', 'first_name', 'last_name', 'email', 'username'],
                    order: { id: 'DESC' }
                });
                if (!data) {
                    throw new Error('User not found');
                }
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    updateUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const user = yield userRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!user) {
                    throw new Error('User not found');
                }
                yield userRepository.update({ id: parseInt(request.params.id, 10) }, request.body);
                const data = yield userRepository.findOne({ id: parseInt(request.params.id, 10) });
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    deleteUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const data = yield userRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!data) {
                    throw new Error('User not found');
                }
                yield userRepository.delete({ id: parseInt(request.params.id, 10) });
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getActivityReports(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const activityReportsRepository = typeorm_1.getRepository(activity_reports_1.ActivityReports);
            try {
                const [data, count] = yield activityReportsRepository.findAndCount({
                    relations: ['activity'],
                    order: { id: 'DESC' },
                    select: ['id', 'reason', 'activity']
                });
                const newData = data.map(e => {
                    return {
                        id: e.id,
                        reason: e.reason,
                        link: `https://castingsecret.com/activity/${e.activity.id}`
                    };
                });
                return response.status(200).send({ data: newData, count });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    deleteReportedActivityFromAdmin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const activityReportsRepository = typeorm_1.getRepository(activity_reports_1.ActivityReports);
            const activityRepository = typeorm_1.getRepository(activity_1.Activity);
            try {
                const report = yield activityReportsRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['activity'] });
                if (!report) {
                    throw new Error('report not found ');
                }
                const allReportsOfPost = yield activityReportsRepository.find({ activity: report.activity });
                const deleteAllreportsOfActivity = yield activityReportsRepository
                    .remove(allReportsOfPost);
                yield activityRepository.remove(report.activity);
                return response.status(200).send({ data: report });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.AdminAdditionController = AdminAdditionController;
//# sourceMappingURL=AdminAddition.js.map