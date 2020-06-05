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
const notify_notification_1 = require("../../models/notify_notification");
const users_profile_1 = require("../../models/users_profile");
const pagination_1 = require("../../helpers/pagination");
const SendNotification_1 = require("../../jobs/SendNotification");
const main_1 = require("../../main");
const notification_admin_panel_1 = require("../../models/notification_admin_panel");
class NotificationsController {
    getAllNotifications(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const NotificationRepository = typeorm_1.getRepository(notify_notification_1.Notification);
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const q = NotificationRepository.createQueryBuilder('n')
                    .where(`n.recipientId = ${profile.id}`)
                    .orderBy('n.id', 'DESC');
                if (request.query.month) {
                    q.andWhere(`month(n.created) = ${request.query.month} and year(n.created) = ${request.query.year}`);
                }
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                return response.status(200).send(responseObject);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getCountOfNewAndNotRead(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const NotificationRepository = typeorm_1.getRepository(notify_notification_1.Notification);
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const count = yield NotificationRepository.count({ recipient: profile, read: false });
                return response.status(200).send({ count });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    makeNotificationRead(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const NotificationRepository = typeorm_1.getRepository(notify_notification_1.Notification);
            try {
                const noti = yield NotificationRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!noti) {
                    throw new Error('notification not found');
                }
                noti.read = true;
                yield NotificationRepository.save(noti);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    makeAllNotificationsRead(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const NotificationRepository = typeorm_1.getRepository(notify_notification_1.Notification);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const noti = yield NotificationRepository.update({ recipient: profile }, { read: true });
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    addNotificationsFromAdmin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const NotificationRepository = typeorm_1.getRepository(notify_notification_1.Notification);
            const AdminNotificationRepository = typeorm_1.getRepository(notification_admin_panel_1.NotificationAdminPanel);
            try {
                const users = yield profileRepository.find({ select: ['id'] });
                const count = yield NotificationRepository.count();
                users.map((e) => __awaiter(this, void 0, void 0, function* () {
                    const notiToQueu = {
                        actor_first_name: 'Casting',
                        actor_last_name: 'Admin ',
                        actor_avatar: 'https://casting-secret-new.s3.eu-central-1.amazonaws.com/admin.jpg',
                        type: SendNotification_1.NotificationTypeEnum.others,
                        msgFromAdmin: request.body.msg,
                        recipient: e.id,
                    };
                    yield main_1.notificationQueue.add(notiToQueu);
                }));
                const newAdminNotification = new notification_admin_panel_1.NotificationAdminPanel();
                newAdminNotification.body = request.body.msg;
                const data = yield AdminNotificationRepository.save(newAdminNotification);
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllNotificationsForAdmin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const AdminNotificationRepository = typeorm_1.getRepository(notification_admin_panel_1.NotificationAdminPanel);
            try {
                const [data, count] = yield AdminNotificationRepository.findAndCount({ order: { id: 'DESC' } });
                return response.status(200).send({ data, count });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getOneNotificationsForAdmin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const AdminNotificationRepository = typeorm_1.getRepository(notification_admin_panel_1.NotificationAdminPanel);
            try {
                const data = yield AdminNotificationRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!data) {
                    throw new Error('given id not found');
                }
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.NotificationsController = NotificationsController;
//# sourceMappingURL=Notifications.js.map