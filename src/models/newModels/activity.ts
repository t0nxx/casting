import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './company';
import { ActivityAttachment } from './activity_attachment';
import { Profile } from './users_profile';
// import {auth_user} from "./auth_user";
// import {company} from "./company";
// import {activity_attachment} from "./activity_attachment";
// import {activity_bookmark} from "./activity_bookmark";
// import {activity_control} from "./activity_control";
// import {activity_ignore} from "./activity_ignore";
// import {activity_mention} from "./activity_mention";
// import {activity_report} from "./activity_report";
// import {activity_social_actions} from "./activity_social_actions";
// import {comments} from "./comments";

@Entity('activity')
export class Activity {

    // PostComment: string,
    // comments: any[],
    // nextComments: string,
    // activity_attachment: { IMG: any[] },
    // blocked: string

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @CreateDateColumn()
    publish_date: Date;

    // @Column({ default: false })
    // is_blocked: boolean;

    // @Column()
    // action: string;

    @Column({ default: true })
    uploadingComment: boolean;

    @Column({ default: 0 })
    comments_count: number;

    @Column({ default: 0 })
    share_count: number;

    @Column({ default: 0 })
    like_count: number;

    @Column({ default: 0 })
    dislike_count: number;

    @ManyToOne(type => Profile, p => p.activity, { onDelete: 'CASCADE' })
    profile: Profile;

    @ManyToOne(type => Company, c => c.activity, { onDelete: 'CASCADE' })
    company: Company;

    @OneToMany(type => ActivityAttachment, ac => ac.activity)
    activity_attachment: ActivityAttachment[];

    @ManyToMany(type => Profile, p => p.likes)
    @JoinTable()
    activity_likers: Profile[];

    @ManyToMany(type => Profile, p => p.dislikes)
    @JoinTable()
    activity_dislikers: Profile[];

    @ManyToMany(type => Profile, p => p.bookmarks)
    @JoinTable()
    activity_bookmarks: Profile[];

    @ManyToMany(type => Profile, p => p.activity_mentions)
    @JoinTable()
    activityMention: Profile[];
    

    // @OneToMany(() => activity_bookmark, (activity_bookmark: activity_bookmark) => activity_bookmark.activity)
    // activityBookmarks: activity_bookmark[];

    // @OneToMany(() => activity_control, (activity_control: activity_control) => activity_control.activity)
    // activityControls: activity_control[];

    // @OneToMany(() => activity_ignore, (activity_ignore: activity_ignore) => activity_ignore.activity)
    // activityIgnores: activity_ignore[];

    // @OneToMany(() => activity_mention, (activity_mention: activity_mention) => activity_mention.activity)
    // activityMentions: activity_mention[];

    // @OneToMany(() => activity_report, (activity_report: activity_report) => activity_report.activity)
    // activityReports: activity_report[];

    // @OneToMany(() => activity_social_actions, (activity_social_actions: activity_social_actions) => activity_social_actions.activity)
    // activitySocialActionss: activity_social_actions[];

    // @OneToMany(() => comments, (comments: comments) => comments.activity)
    // commentss: comments[];

}
