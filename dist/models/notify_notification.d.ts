import { django_content_type } from "./django_content_type";
import { auth_user } from "./auth_user";
export declare class notify_notification {
    id: number;
    actor_object_id: number | null;
    actor_text: string | null;
    actor_url_text: string | null;
    verb: string;
    description: string | null;
    nf_type: string;
    target_object_id: number | null;
    target_text: string | null;
    target_url_text: string | null;
    obj_object_id: number | null;
    obj_text: string | null;
    obj_url_text: string | null;
    extra: object | null;
    created: Date;
    read: boolean;
    deleted: boolean;
    actorContentType: django_content_type | null;
    objContentType: django_content_type | null;
    recipient: auth_user | null;
    targetContentType: django_content_type | null;
}
