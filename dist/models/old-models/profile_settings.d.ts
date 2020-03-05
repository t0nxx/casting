import { users_profile } from "./users_profile";
export declare class profile_settings {
    id: number;
    can_see_profile: string | null;
    can_see_wall: string | null;
    can_comment: string | null;
    can_contact_info: string | null;
    can_send_message: string | null;
    response_all_time: boolean;
    response_from: Date | null;
    response_to: Date | null;
    response_message: string | null;
    auto_play_video: boolean;
    jobs_notification: boolean;
    userProfile: users_profile | null;
    can_see_friends: string | null;
    my_status: string | null;
}
