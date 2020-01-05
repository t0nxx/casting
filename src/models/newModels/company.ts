import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Profile } from './users_profile';
import { TalentCategories } from './talent_categories';
import { Activity } from './activity';
// import {users_profile} from "./users_profile";
// import {activity} from "./activity";
// import {company_tags} from "./company_tags";
// import {jobs} from "./jobs";

@Entity('company')
export class Company {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'https://casting-secret-new.s3.eu-central-1.amazonaws.com/company-avatar.png' })
    avatar: string;

    @Column({ default: 'https://casting-secret-new.s3.eu-central-1.amazonaws.com/banner.jpg' })
    cover: string;

    @Column()
    name: string;

    @Column({ default: 'no data provided' })
    about: string;

    @Column({ default: 'no data provided' })
    headquarter: string;

    @Column({ default: false })
    is_address_public: boolean;

    @Column({ default: 'castingsecret.com' })
    website: string;

    @Column({ default: '2000' })
    since: string;

    @Column({ default: 1 })
    size_from: number ;

    @Column({ default: 100 })
    size_to: number;

    @Column({ unique: true })
    slug: string;

    @ManyToOne(type => Profile, p => p.companies, { onDelete: 'CASCADE' })
    profile: Profile;

    @ManyToMany(type => TalentCategories, { onDelete: 'CASCADE' })
    @JoinTable()
    tags: TalentCategories[];

    @ManyToMany(type => Profile, { onDelete: 'CASCADE' })
    @JoinTable()
    followers: Profile[];

    @OneToMany(type => Activity, a => a.company)
    activity: Activity[];

    // @OneToMany(()=>activity, (activity: activity)=>activity.company)
    // activitys:activity[];

}
