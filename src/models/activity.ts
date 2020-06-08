import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './company';
import { ActivityAttachment } from './activity_attachment';
import { Profile } from './users_profile';
import { Comment } from './comments';
import { ActivityReports } from './activity_reports';

@Entity('activity')
export class Activity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('longtext')
    content: string;

    @CreateDateColumn()
    publish_date: Date;

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

    @Column({ default: 0 })
    resports_count: number;

    @ManyToOne(type => Profile, p => p.activity, { onDelete: 'CASCADE' })
    profile: Profile;

    @ManyToOne(type => Company, c => c.activity, { onDelete: 'CASCADE' })
    company: Company;

    @OneToMany(type => ActivityAttachment, ac => ac.activity)
    activity_attachment: ActivityAttachment[];

    @OneToMany(type => Comment, ac => ac.activity)
    activity_Comments: Comment[];

    @OneToMany(type => ActivityReports, ac => ac.activity)
    reports: ActivityReports[];

    @ManyToMany(type => Profile, p => p.likes)
    @JoinTable()
    activity_likers: Profile[];

    @ManyToMany(type => Profile, p => p.dislikes)
    @JoinTable()
    activity_dislikers: Profile[];

    @ManyToMany(type => Profile, p => p.bookmarks)
    @JoinTable()
    activity_bookmarks: Profile[];

    @ManyToMany(type => Profile, p => p.hidden)
    @JoinTable()
    activity_hidden: Profile[];

    @ManyToMany(type => Profile, p => p.activity_mentions)
    @JoinTable()
    activityMention: Profile[];

}
