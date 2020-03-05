import { activity } from "./activity";
import { auth_user } from "./auth_user";
export declare class activity_control {
    id: number;
    publish_date: Date;
    is_hidden: boolean;
    is_saved: boolean;
    is_reported: boolean;
    activity: activity | null;
    authUser: auth_user | null;
}
