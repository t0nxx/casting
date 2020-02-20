import { getRepository } from 'typeorm';
import { Notification } from '../models/newModels/notify_notification';
import { Profile } from '../models/newModels/users_profile';


function getVerbType(type: number, interviewDate?: Date, interviewName?: string, interviewLocation?: string, msg?: string) {
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
            // add 3 hourse cause server in europe and client in ksa +3 gmt
            const date = new Date(interviewDate)
            date.setHours(date.getHours() + 3);
            verb = `Congratulation! You Accept In Job And Have Inivitation For Interview
             on ${date} 
             location ${interviewLocation}
             With Mr/ ${interviewName}`;
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

export enum NotificationTypeEnum {
    like = 0,
    dislike = 1,
    comment = 2,
    reply = 3,
    interview = 4,
    newAapplicantAdmin = 5,
    remienderIntervewAdmin = 6,
    mentionOnPost = 7,
    mentionOnComment = 8,
    newJobFromFollowedCompany = 9,
    sendFriendReq = 10,
    acceptFriendReq = 11,
    others = 12,


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
    target_profile_slug?: string;
    actor_last_name?: string;
    interviewDate?: Date;
    interviewName?: string;
    interviewLocation?: string;
    msgFromAdmin?: string;

}

export default async function ({ data }) {
    const NotificationsRepository = getRepository(Notification);
    const ProfileRepository = getRepository(Profile);
    try {
        const recipient = await ProfileRepository.findOne({ id: data.recipient }, { select: ['id'] });
        if (!recipient) { throw new Error('recipient profile not found '); }

        const newNoti = new Notification();
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
                    getVerbType(data.type);// users.map(async e => {
        //     const notiToQueu: NotificationShape = {
        //         actor_first_name: 'Casting',
        //         actor_last_name: 'Admin ',
        //         actor_avatar: 'https://casting-secret-new.s3.eu-central-1.amazonaws.com/admin.jpg',
        //         type: NotificationTypeEnum.others,
        //         msgFromAdmin: request.body.msg,
        //         recipient: e.id,
        //     }
        //     await notificationQueue.add(notiToQueu);
        // })

        newNoti.recipient = recipient;
        await NotificationsRepository.save(newNoti);

    } catch (error) {
        console.log('errror in notifications              ' + error);
    }
}
