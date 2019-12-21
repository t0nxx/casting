import { Profile } from './users_profile';
export declare class Notification {
    id: number;
    verb: string;
    type: number;
    target_slug: string;
    target_id: number;
    created: Date;
    read: boolean;
    actor_first_name: string;
    actor_last_name: string;
    actor_avatar: string;
    recipient: Profile;
}
