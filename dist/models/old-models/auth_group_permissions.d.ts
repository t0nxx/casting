import { auth_group } from "./auth_group";
import { auth_permission } from "./auth_permission";
export declare class auth_group_permissions {
    id: number;
    group: auth_group | null;
    permission: auth_permission | null;
}
