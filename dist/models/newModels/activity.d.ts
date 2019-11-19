import { Company } from './company';
import { ActivityAttachment } from './activity_attachment';
import { Profile } from './users_profile';
export declare class Activity {
    id: number;
    content: string;
    publish_date: Date;
    uploadingComment: boolean;
    comments_count: number;
    share_count: number;
    like_count: number;
    dislike_count: number;
    profile: Profile;
    company: Company;
    activity_attachment: ActivityAttachment[];
    activity_likers: Profile[];
    activity_dislikers: Profile[];
    activity_bookmarks: Profile[];
    activity_hidden: Profile[];
    activityMention: Profile[];
}
