import { Activity } from "./activity";
import { Profile } from "./users_profile";
export declare enum AttachmentEnum {
    VIEDO = "VIDEO",
    AUDIO = "AUDIO",
    IMG = "IMG"
}
export declare class ActivityAttachment {
    id: number;
    publish_date: Date;
    path: string;
    type: string;
    activity: Activity;
    profile: Profile;
}
