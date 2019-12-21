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
const notify_notification_1 = require("../models/newModels/notify_notification");
const users_profile_1 = require("../models/newModels/users_profile");
function getVerbType(type, interviewDate, interviewName) {
    let verb = '';
    switch (type) {
        case 0:
            verb = 'Liked Your  Post';
            break;
        case 1:
            verb = 'DisLiked Your  Post';
            break;
        case 2:
            verb = 'Commented On  Your  Post';
            break;
        case 3:
            verb = 'Replied On  Your  Comment';
            break;
        case 4:
            const date = new Date(interviewDate).toUTCString();
            verb = `Congratulation! You Accept In Job And Have Inivitation For Interview
             on ${date}   With Mr/ ${interviewName}`;
            break;
        case 5:
            verb = `New Applicant On Your Job! Have A Good Chance :) `;
            break;
        case 6:
            verb = `We remind you that tomorrow there is a job interview for your job `;
            break;
        default:
            verb = `We remind you that site has new updates`;
            break;
    }
    return verb;
}
var NotificationTypeEnum;
(function (NotificationTypeEnum) {
    NotificationTypeEnum[NotificationTypeEnum["like"] = 0] = "like";
    NotificationTypeEnum[NotificationTypeEnum["dislike"] = 1] = "dislike";
    NotificationTypeEnum[NotificationTypeEnum["comment"] = 2] = "comment";
    NotificationTypeEnum[NotificationTypeEnum["reply"] = 3] = "reply";
    NotificationTypeEnum[NotificationTypeEnum["interview"] = 4] = "interview";
    NotificationTypeEnum[NotificationTypeEnum["newAapplicantAdmin"] = 5] = "newAapplicantAdmin";
    NotificationTypeEnum[NotificationTypeEnum["remienderIntervewAdmin"] = 6] = "remienderIntervewAdmin";
    NotificationTypeEnum[NotificationTypeEnum["others"] = 7] = "others";
})(NotificationTypeEnum = exports.NotificationTypeEnum || (exports.NotificationTypeEnum = {}));
function default_1({ data }) {
    return __awaiter(this, void 0, void 0, function* () {
        const NotificationsRepository = typeorm_1.getRepository(notify_notification_1.Notification);
        const ProfileRepository = typeorm_1.getRepository(users_profile_1.Profile);
        try {
            const recipient = yield ProfileRepository.findOne({ id: data.recipient });
            if (!recipient) {
                throw new Error('recipient profile not found ');
            }
            const newNoti = new notify_notification_1.Notification();
            newNoti.actor_first_name = data.actor_first_name;
            newNoti.actor_avatar = data.actor_avatar;
            if (data.actor_last_name) {
                newNoti.actor_last_name = data.actor_last_name;
            }
            if (data.target_id) {
                newNoti.target_id = data.target_id;
            }
            if (data.target_slug) {
                newNoti.target_slug = data.target_slug;
            }
            newNoti.type = data.type;
            newNoti.verb = data.type === 4 ? getVerbType(data.type, data.interviewDate, data.interviewName) : getVerbType(data.type);
            newNoti.recipient = recipient;
            yield NotificationsRepository.save(newNoti);
        }
        catch (error) {
            console.log('errror in notifications              ' + error);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=SendNotification.js.map