import { django_content_type } from "./django_content_type";
import { auth_user } from "./auth_user";
export declare class django_admin_log {
    id: number;
    action_time: Date;
    object_id: string | null;
    object_repr: string;
    action_flag: number;
    change_message: string;
    contentType: django_content_type | null;
    user: auth_user | null;
}
