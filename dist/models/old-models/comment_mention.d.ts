import { auth_user } from "./auth_user";
import { comments } from "./comments";
export declare class comment_mention {
    id: number;
    publish_date: Date;
    authUser: auth_user | null;
    comment: comments | null;
}
