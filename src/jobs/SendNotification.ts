import { getRepository } from 'typeorm';
import { Notification } from '../models/newModels/notify_notification';
import { Profile } from '../models/newModels/users_profile';


function getVerbType(type: number, interviewDate?: Date, interviewName?: string) {
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

export enum NotificationTypeEnum {
    like = 0,
    dislike = 1,
    comment = 2,
    reply = 3,
    interview = 4,
    newAapplicantAdmin = 5,
    remienderIntervewAdmin = 6,
    others = 7,


}
export interface NotificationShape {
    /**
     * type of notification
     * 1 - post
     * 2- job
     * 3- other
     */
    type: NotificationTypeEnum;
    // verb: string;
    // if no last name : the actor is company ;
    actor_first_name: string;

    actor_avatar: string;

    recipient: number;

    // optional 
    // id of post
    target_id?: number;
    // slug of the job
    target_slug?: string;
    target_company?: string;
    actor_last_name?: string;
    interviewDate?: Date;
    interviewName?: string;

}

export default async function ({ data }) {
    const NotificationsRepository = getRepository(Notification);
    const ProfileRepository = getRepository(Profile);
    try {
        const recipient = await ProfileRepository.findOne({ id: data.recipient });
        if (!recipient) { throw new Error('recipient profile not found '); }

        const newNoti = new Notification();
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
        if (data.target_company) {
            newNoti.target_company = data.target_company;
        }
        newNoti.type = data.type;
        newNoti.verb = data.type === 4 ? getVerbType(data.type, data.interviewDate, data.interviewName) : getVerbType(data.type);
        newNoti.recipient = recipient;
        await NotificationsRepository.save(newNoti);

    } catch (error) {
        console.log('errror in notifications              ' + error);
    }
}
