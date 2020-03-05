import { auth_user } from "./auth_user";
import { company } from "./company";
import { activity_attachment } from "./activity_attachment";
import { activity_bookmark } from "./activity_bookmark";
import { activity_control } from "./activity_control";
import { activity_ignore } from "./activity_ignore";
import { activity_mention } from "./activity_mention";
import { activity_report } from "./activity_report";
import { activity_social_actions } from "./activity_social_actions";
import { comments } from "./comments";
export declare class activity {
    id: number;
    content: string | null;
    publish_date: Date;
    is_blocked: boolean;
    action: string | null;
    is_active: boolean;
    authUser: auth_user | null;
    company: company | null;
    originalActivity: activity | null;
    activitys: activity[];
    activityAttachments: activity_attachment[];
    activityBookmarks: activity_bookmark[];
    activityControls: activity_control[];
    activityIgnores: activity_ignore[];
    activityMentions: activity_mention[];
    activityReports: activity_report[];
    activitySocialActionss: activity_social_actions[];
    commentss: comments[];
}
