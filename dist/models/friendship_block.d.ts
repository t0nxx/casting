import { auth_user } from "./auth_user";
export declare class friendship_block {
    id: number;
    created: Date;
    blocked: auth_user | null;
    blocker: auth_user | null;
}
