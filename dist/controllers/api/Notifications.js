"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const notify_notification_1 = require("../../models/newModels/notify_notification");
class NotificationsController {
    getAllNotifications(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const NotificationRepository = typeorm_1.getRepository(notify_notification_1.Notification);
            try {
                const data = {
                    results: [
                        {
                            id: 1,
                            read: false,
                            created: new Date(),
                            verb: 'حمادة علق على منشورك',
                            target_url: 130,
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
                            actor: {
                                first_name: 'first name of notifier',
                                last_name: 'last name of notifer',
                            }
                        }
                    ],
                    count: 3
                };
                return response.status(200).send(data);
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