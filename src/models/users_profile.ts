import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './auth_user';
import { TalentCategories } from './talent_categories';
import { WeightRangeLookup } from './weight_range_lookup';
import { HeightRangeLookup } from './height_range_lookup';
import { EyeLookup } from './eye_lookup';
import { HairLookup } from './hair_lookup';
import { BuildLookup } from './build_lookup';
import { EthnicitiesLookup } from './ethnicities_lookup';
import { Hobbies } from './profile_hobbies';
import { Courses } from './profile_courses';
import { ProfileSocialNetworks } from './profile_social';
import { Company } from './company';
import { ProfileAlbum } from './profile_album';
import { ActivityAttachment } from './activity_attachment';
import { Activity } from './activity';
import { Comment } from './comments';
import { Jobs } from './jobs';
import { JobInterview } from './jobs_interview';
import { JobApplicants } from './jobs_applicants';
import { JobShortlist } from './jobs_shortlisted';
import { ActivityReports } from './activity_reports';
import { Notification } from './notify_notification';
import { WhoSeeMe } from './who_see_me';

@Entity('users_profile')
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'https://casting-secret-new.s3.eu-central-1.amazonaws.com/avatar1.png' })
    avatar: string;

    @Column({ default: 'https://casting-secret-new.s3.eu-central-1.amazonaws.com/banner.jpg' })
    cover: string;

    @Column({ default: 'male' })
    gender: string;

    @Column({ default: 'Not Provided' })
    location: string;

    @Column({ default: '2020-01-01T22:00:00.000Z' })
    birthDate: string;

    @Column('longtext')
    about: string;

    @Column({ default: 'Not Provided' })
    phone: string;

    @Column({ nullable: false, unique: true })
    slug: string;

    @Column({ default: 5 })
    age_from: number;

    @Column({ default: 100 })
    age_to: number;

    @ManyToOne(type => User, user => user.profiles, { onDelete: 'CASCADE' })
    user: User;

    /// talent categories , art, music ... etc
    @ManyToMany(type => TalentCategories, { onDelete: 'CASCADE' })
    @JoinTable()
    categories: TalentCategories[];

    /// hobbies 
    @ManyToMany(type => Hobbies, { onDelete: 'CASCADE', eager: true })
    @JoinTable()
    users_profile_hobbies: Hobbies[];

    // courses 
    @ManyToMany(type => Courses, { onDelete: 'CASCADE', eager: true })
    @JoinTable()
    users_profile_courses: Courses[];

    // social network "accounts"
    @ManyToMany(type => ProfileSocialNetworks, { onDelete: 'CASCADE', eager: true })
    @JoinTable()
    users_profile_social: ProfileSocialNetworks[];

    // companies
    @OneToMany(type => Company, c => c.profile)
    companies: Company[];

    // albums
    @OneToMany(type => ProfileAlbum, p => p.profile)
    albums: ProfileAlbum[];

    @ManyToOne(type => WeightRangeLookup, { eager: true })
    weight: WeightRangeLookup;

    @ManyToOne(type => HeightRangeLookup, { eager: true })
    height: HeightRangeLookup;

    @ManyToOne(type => EyeLookup, { eager: true })
    eye: EyeLookup;

    @ManyToOne(type => HairLookup, { eager: true })
    hair: HairLookup;

    @ManyToOne(type => BuildLookup, { eager: true })
    build: BuildLookup;

    @ManyToOne(type => EthnicitiesLookup, { eager: true })
    ethnicity: EthnicitiesLookup;

    @OneToMany(type => ActivityAttachment, ac => ac.profile)
    activity_attachment: ActivityAttachment[];

    @OneToMany(type => Activity, a => a.profile)
    activity: Activity[];

    @ManyToMany(type => Activity, ac => ac.activity_likers)
    likes: Activity[];

    @ManyToMany(type => Activity, ac => ac.activity_dislikers)
    dislikes: Activity[];

    @ManyToMany(type => Activity, ac => ac.activity_bookmarks)
    bookmarks: Activity[];

    @ManyToMany(type => Activity, ac => ac.activity_hidden)
    hidden: Activity[];

    @ManyToMany(type => Activity, ac => ac.activityMention)
    activity_mentions: Activity[];

    @ManyToMany(type => Comment, c => c.commentMention)
    comment_mentions: Comment[];

    @OneToMany(type => Comment, c => c.profile)
    activity_Comments: Comment[];

    @OneToMany(type => Notification, n => n.recipient)
    notifications: Notification[];

    @OneToMany(type => JobInterview, j => j.profile)
    interview_jobs: JobInterview[];

    @OneToMany(type => JobApplicants, j => j.profile)
    applied_jobs: JobApplicants[];

    @OneToMany(type => JobShortlist, j => j.profile)
    shortlisted_jobs: JobShortlist[];

    @OneToMany(type => ActivityReports, a => a.profile)
    activity_reports: ActivityReports[];

}
