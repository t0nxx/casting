import { users_profile } from "./users_profile";
import { activity_attachment } from "./activity_attachment";
export declare class profile_album {
    id: number;
    publish_date: Date;
    album_name: string;
    userProfile: users_profile | null;
    activityAttachments: activity_attachment[];
}
