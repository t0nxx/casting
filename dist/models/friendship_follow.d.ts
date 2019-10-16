import { auth_user } from "./auth_user";
export declare class friendship_follow {
    id: number;
    created: Date;
    followee: auth_user | null;
    follower: auth_user | null;
}
