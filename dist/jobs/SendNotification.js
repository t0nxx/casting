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
const notify_notification_1 = require("../models/notify_notification");
const users_profile_1 = require("../models/users_profile");
const moment = require("moment-timezone");
function getVerbType(type, interviewDate, interviewName, interviewLocation, msg) {
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
            const date = moment(interviewDate).tz('Asia/Riyadh').format('dddd Do MMMM YYYY ha');
            verb = `Congratulation! You Accept In Job And Have Invitation For Interview \n
             on ${date}, \n
             location ${interviewLocation} , \n
             Contact Number ${interviewName}`;
            break;
        case 5:
            verb = `New Applicant On Your Job! Have A Good Chance :) `;
            break;
        case 6:
            verb = `We remind you that tomorrow there is a job interview for your job `;
            break;
        case 7:
            verb = 'Mention You In Post';
            break;
        case 8:
            verb = 'Mention You In Comment';
            break;
        case 9:
            verb = 'Your Followed Company Has New Job ';
            break;
        case 10:
            verb = 'Send You Friend Request  ';
            break;
        case 11:
            verb = 'Accept Your Friend Request ';
            break;
        default:
            verb = msg;
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
    NotificationTypeEnum[NotificationTypeEnum["mentionOnPost"] = 7] = "mentionOnPost";
    NotificationTypeEnum[NotificationTypeEnum["mentionOnComment"] = 8] = "mentionOnComment";
    NotificationTypeEnum[NotificationTypeEnum["newJobFromFollowedCompany"] = 9] = "newJobFromFollowedCompany";
    NotificationTypeEnum[NotificationTypeEnum["sendFriendReq"] = 10] = "sendFriendReq";
    NotificationTypeEnum[NotificationTypeEnum["acceptFriendReq"] = 11] = "acceptFriendReq";
    NotificationTypeEnum[NotificationTypeEnum["others"] = 12] = "others";
})(NotificationTypeEnum = exports.NotificationTypeEnum || (exports.NotificationTypeEnum = {}));
function default_1({ data }) {
    return __awaiter(this, void 0, void 0, function* () {
        const NotificationsRepository = typeorm_1.getRepository(notify_notification_1.Notification);
        const ProfileRepository = typeorm_1.getRepository(users_profile_1.Profile);
        try {
            const recipient = yield ProfileRepository.findOne({ id: data.recipient }, { select: ['id'] });
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
                newNoti.target_activity_id = data.target_id;
            }
            if (data.target_slug) {
                newNoti.target_job_slug = data.target_slug;
            }
            if (data.target_company) {
                newNoti.target_company = data.target_company;
            }
            if (data.target_profile_slug) {
                newNoti.target_profile_slug = data.target_profile_slug;
            }
            newNoti.type = data.type;
            newNoti.verb =
                data.type === 4 ? getVerbType(data.type, data.interviewDate, data.interviewName, data.interviewLocation) :
                    data.type === 12 ? getVerbType(data.type, null, null, null, data.msgFromAdmin) :
                        getVerbType(data.type);
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