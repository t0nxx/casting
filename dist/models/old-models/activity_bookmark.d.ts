import { activity } from "./activity";
import { auth_user } from "./auth_user";
export declare class activity_bookmark {
    id: number;
    publish_date: Date;
    activity: activity | null;
    authUser: auth_user | null;
}
