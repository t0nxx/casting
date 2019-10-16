import { activity } from "./activity";
import { auth_user } from "./auth_user";
export declare class activity_social_actions {
    id: number;
    publish_date: Date;
    has_like: boolean;
    has_dislike: boolean;
    has_share: boolean;
    activity: activity | null;
    authUser: auth_user | null;
}
