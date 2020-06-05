export declare enum NotificationTypeEnum {
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
    others = 12
}
export interface NotificationShape {
    type: NotificationTypeEnum;
    actor_first_name: string;
    actor_avatar: string;
    recipient: number;
    target_id?: number;
    target_slug?: string;
    target_company?: string;
    target_profile_slug?: string;
    actor_last_name?: string;
    interviewDate?: Date;
    interviewName?: string;
    interviewLocation?: string;
    msgFromAdmin?: string;
}
export default function ({ data }: {
    data: any;
}): Promise<void>;
