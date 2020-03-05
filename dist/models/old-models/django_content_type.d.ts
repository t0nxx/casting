import { auth_permission } from "./auth_permission";
import { django_admin_log } from "./django_admin_log";
import { notify_notification } from "./notify_notification";
export declare class django_content_type {
    id: number;
    app_label: string;
    model: string;
    authPermissions: auth_permission[];
    djangoAdminLogs: django_admin_log[];
    notifyNotifications: notify_notification[];
    notifyNotifications2: notify_notification[];
    notifyNotifications3: notify_notification[];
}
