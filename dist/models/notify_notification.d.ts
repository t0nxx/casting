import { Profile } from './users_profile';
export declare class Notification {
    id: number;
    verb: string;
    type: number;
    target_job_slug: string;
    target_profile_slug: string;
    target_company: string;
    target_activity_id: number;
    created: Date;
    read: boolean;
    actor_first_name: string;
    actor_last_name: string;
    actor_avatar: string;
    recipient: Profile;
}
