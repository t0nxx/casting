import { auth_user } from "./auth_user";
import { auth_group } from "./auth_group";
export declare class auth_user_groups {
    id: number;
    user: auth_user | null;
    group: auth_group | null;
}
