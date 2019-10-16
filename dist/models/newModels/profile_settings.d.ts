import { Profile } from './users_profile';
export declare class ProfileSettings {
    id: number;
    can_see_profile: string;
    can_see_wall: string;
    can_comment: string;
    can_contact_info: string;
    can_send_message: string;
    response_all_time: boolean;
    response_from: Date;
    response_to: Date;
    response_message: string;
    auto_play_video: boolean;
    jobs_notification: boolean;
    can_see_friends: string;
    my_status: string;
    profile: Profile;
}
