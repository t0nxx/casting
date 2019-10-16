import { auth_user } from "./auth_user";
export declare class friendship_friend {
    id: number;
    created: Date;
    fromUser: auth_user | null;
    toUser: auth_user | null;
}
