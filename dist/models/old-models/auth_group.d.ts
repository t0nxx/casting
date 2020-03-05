import { auth_group_permissions } from "./auth_group_permissions";
import { auth_user_groups } from "./auth_user_groups";
export declare class auth_group {
    id: number;
    name: string;
    authGroupPermissionss: auth_group_permissions[];
    authUserGroupss: auth_user_groups[];
}
