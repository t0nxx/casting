import { Profile } from "./users_profile";
import { ActivityAttachment } from "./activity_attachment";
export declare class ProfileAlbum {
    id: number;
    publish_date: Date;
    album_name: string;
    profile: Profile;
    activity_attachment: ActivityAttachment[];
}
