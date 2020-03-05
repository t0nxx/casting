import { auth_user } from "./auth_user";
export declare class friendship_friendshiprequest {
    id: number;
    message: string;
    created: Date;
    rejected: Date | null;
    viewed: Date | null;
    fromUser: auth_user | null;
    toUser: auth_user | null;
}
