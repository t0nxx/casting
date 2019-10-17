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
// import {auth_user} from "./auth_user";
// import {build_lookup} from "./build_lookup";
// import {ethnicities_lookup} from "./ethnicities_lookup";
// import {eye_lookup} from "./eye_lookup";
// import {hair_lookup} from "./hair_lookup";
// import {height_range_lookup} from "./height_range_lookup";
// import {weight_range_lookup} from "./weight_range_lookup";
// import {company} from "./company";
// import {job_applicants} from "./job_applicants";
// import {job_schedules} from "./job_schedules";
// import {job_shortlisted} from "./job_shortlisted";
// import {profile_album} from "./profile_album";
// import {profile_hobbies} from "./profile_hobbies";
// import {profile_settings} from "./profile_settings";
// import {profile_social_networks} from "./profile_social_networks";
// import {profile_training} from "./profile_training";
// import {profile_viewers} from "./profile_viewers";
// import {users_profile_categories} from "./users_profile_categories";

@Entity('users_profile')
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'https://news-app-uploads.s3.eu-central-1.amazonaws.com/1567899027453 - download.png' })
    avatar: string;

    @Column({ default: 'https://news-app-uploads.s3.eu-central-1.amazonaws.com/1567899027453 - download.png' })
    cover: string;

    @Column({ default: 'Not Provided' })
    gender: string;

    @Column({ default: 'Not Provided' })
    location: string;

    @Column({ default: 'Not Provided' })
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
    @ManyToMany(type => Hobbies, { onDelete: 'CASCADE' })
    @JoinTable()
    hobbies: Hobbies[];

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
    // @ManyToOne(() => build_lookup, (build_lookup: build_lookup) => build_lookup.usersProfiles, {})
    // @JoinColumn({ name: 'build_id' })
    // build: build_lookup | null;

    // @ManyToOne(() => ethnicities_lookup, (ethnicities_lookup: ethnicities_lookup) => ethnicities_lookup.usersProfiles, {})
    // @JoinColumn({ name: 'ethnicity_id' })
    // ethnicity: ethnicities_lookup | null;

    // @ManyToOne(() => eye_lookup, (eye_lookup: eye_lookup) => eye_lookup.usersProfiles, {})
    // @JoinColumn({ name: 'eye_id' })
    // eye: eye_lookup | null;

    // @ManyToOne(() => hair_lookup, (hair_lookup: hair_lookup) => hair_lookup.usersProfiles, {})
    // @JoinColumn({ name: 'hair_id' })
    // hair: hair_lookup | null;

    // @ManyToOne(() => height_range_lookup, (height_range_lookup: height_range_lookup) => height_range_lookup.usersProfiles, {})
    // @JoinColumn({ name: 'height_id' })
    // height: height_range_lookup | null;

    // @ManyToOne(() => weight_range_lookup, (weight_range_lookup: weight_range_lookup) => weight_range_lookup.usersProfiles, {})
    // @JoinColumn({ name: 'weight_id' })
    // weight: weight_range_lookup | null;


    // @OneToMany(() => company, (company: company) => company.profile)
    // companys: company[];

    // @OneToMany(() => job_applicants, (job_applicants: job_applicants) => job_applicants.profile)
    // jobApplicantss: job_applicants[];

    // @OneToMany(() => job_schedules, (job_schedules: job_schedules) => job_schedules.profile)
    // jobScheduless: job_schedules[];

    // @OneToMany(() => job_shortlisted, (job_shortlisted: job_shortlisted) => job_shortlisted.profile)
    // jobShortlisteds: job_shortlisted[];

    // @OneToMany(() => profile_album, (profile_album: profile_album) => profile_album.userProfile)
    // profileAlbums: profile_album[];

    // @OneToMany(() => profile_hobbies, (profile_hobbies: profile_hobbies) => profile_hobbies.userProfile)
    // profileHobbiess: profile_hobbies[];

    // @OneToMany(() => profile_settings, (profile_settings: profile_settings) => profile_settings.userProfile)
    // profileSettingss: profile_settings[];

    // @OneToMany(() => profile_social_networks, (profile_social_networks: profile_social_networks) => profile_social_networks.userProfile)
    // profileSocialNetworkss: profile_social_networks[];

    // @OneToMany(() => profile_training, (profile_training: profile_training) => profile_training.userProfile)
    // profileTrainings: profile_training[];

    // @OneToMany(() => profile_viewers, (profile_viewers: profile_viewers) => profile_viewers.userProfile)
    // profileViewerss: profile_viewers[];

    // @OneToMany(() => profile_viewers, (profile_viewers: profile_viewers) => profile_viewers.visitorProfile)
    // profileViewerss2: profile_viewers[];

    // @OneToMany(() => users_profile_categories, (users_profile_categories: users_profile_categories) => users_profile_categories.userProfile)
    // usersProfileCategoriess: users_profile_categories[];

}
