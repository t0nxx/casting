import { activity } from "./activity";
import { auth_user } from "./auth_user";
import { comment_mention } from "./comment_mention";
export declare class comments {
    id: number;
    comment: string;
    publish_date: Date;
    activity: activity | null;
    authUser: auth_user | null;
    thread: comments | null;
    commentMentions: comment_mention[];
    commentss: comments[];
}
