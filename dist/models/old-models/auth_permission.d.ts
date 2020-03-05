import { django_content_type } from "./django_content_type";
import { auth_group_permissions } from "./auth_group_permissions";
import { auth_user_user_permissions } from "./auth_user_user_permissions";
export declare class auth_permission {
    id: number;
    name: string;
    contentType: django_content_type | null;
    codename: string;
    authGroupPermissionss: auth_group_permissions[];
    authUserUserPermissionss: auth_user_user_permissions[];
}
