export declare enum NotificationTypeEnum {
    like = 0,
    dislike = 1,
    comment = 2,
    reply = 3,
    interview = 4,
    newAapplicantAdmin = 5,
    remienderIntervewAdmin = 6,
    others = 7
}
export interface NotificationShape {
    type: NotificationTypeEnum;
    actor_first_name: string;
    actor_avatar: string;
    recipient: number;
    target_id?: number;
    target_slug?: string;
    actor_last_name?: string;
    interviewDate?: Date;
    interviewName?: string;
}
export default function ({ data }: {
    data: any;
}): Promise<void>;
