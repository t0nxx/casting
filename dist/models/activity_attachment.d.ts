import { activity } from "./activity";
import { profile_album } from "./profile_album";
import { auth_user } from "./auth_user";
export declare class activity_attachment {
    id: number;
    publish_date: Date;
    path: string | null;
    type: string;
    activity: activity | null;
    album: profile_album | null;
    authUser: auth_user | null;
    path_json: string;
}
