import { Profile } from './users_profile';
export declare enum settingsView {
    ONLY_FRIENDS = "ONLY_FRIENDS",
    COMPANY = "COMPANY",
    ALL = "ALL"
}
export declare enum myStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE"
}
export declare class ProfileSettings {
    id: number;
    can_see_profile: settingsView;
    can_see_wall: settingsView;
    can_comment: settingsView;
    can_contact_info: settingsView;
    can_send_message: settingsView;
    can_see_friends: settingsView;
    can_see_phone: settingsView;
    response_all_time: boolean;
    response_from: Date;
    response_to: Date;
    response_message: string;
    auto_play_video: boolean;
    jobs_notification: boolean;
    mute_all_chats: boolean;
    sound_alert: boolean;
    my_status: myStatus;
    latest_action: Date;
    profile: Profile;
}
