import { Activity } from './activity';
import { Profile } from './users_profile';
export declare class Comment {
    id: number;
    comment: string;
    publish_date: Date;
    activity: Activity;
    profile: Profile;
    commentMention: Profile[];
    thread: Comment;
    comments_count: number;
}
