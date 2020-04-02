import { account_emailaddress } from "./account_emailaddress";
import { activity } from "./activity";
import { activity_attachment } from "./activity_attachment";
import { activity_bookmark } from "./activity_bookmark";
import { activity_control } from "./activity_control";
import { activity_ignore } from "./activity_ignore";
import { activity_mention } from "./activity_mention";
import { activity_report } from "./activity_report";
import { activity_social_actions } from "./activity_social_actions";
import { auth_user_groups } from "./auth_user_groups";
import { auth_user_user_permissions } from "./auth_user_user_permissions";
import { authtoken_token } from "./authtoken_token";
import { comment_mention } from "./comment_mention";
import { comments } from "./comments";
import { django_admin_log } from "./django_admin_log";
import { friendship_block } from "./friendship_block";
import { friendship_follow } from "./friendship_follow";
import { friendship_friend } from "./friendship_friend";
import { friendship_friendshiprequest } from "./friendship_friendshiprequest";
import { notify_notification } from "./notify_notification";
import { socialaccount_socialaccount } from "./socialaccount_socialaccount";
import { users_profile } from "./users_profile";
export declare class auth_user {
    id: number;
    password: string;
    last_login: Date | null;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: Date;
    accountEmailaddresss: account_emailaddress[];
    activitys: activity[];
    activityAttachments: activity_attachment[];
    activityBookmarks: activity_bookmark[];
    activityControls: activity_control[];
    activityIgnores: activity_ignore[];
    activityMentions: activity_mention[];
    activityReports: activity_report[];
    activitySocialActionss: activity_social_actions[];
    authUserGroupss: auth_user_groups[];
    authUserUserPermissionss: auth_user_user_permissions[];
    authtokenToken: authtoken_token | null;
    commentMentions: comment_mention[];
    commentss: comments[];
    djangoAdminLogs: django_admin_log[];
    friendshipBlocks: friendship_block[];
    friendshipBlocks2: friendship_block[];
    friendshipFollows: friendship_follow[];
    friendshipFollows2: friendship_follow[];
    friendshipFriends: friendship_friend[];
    friendshipFriends2: friendship_friend[];
    friendshipFriendshiprequests: friendship_friendshiprequest[];
    friendshipFriendshiprequests2: friendship_friendshiprequest[];
    notifyNotifications: notify_notification[];
    socialaccountSocialaccounts: socialaccount_socialaccount[];
    usersProfiles: users_profile[];
}