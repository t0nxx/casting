import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Profile } from './users_profile';
import { TalentCategories } from './talent_categories';
// import {users_profile} from "./users_profile";
// import {activity} from "./activity";
// import {company_tags} from "./company_tags";
// import {jobs} from "./jobs";

@Entity('company')
export class Company {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'https://casting-secret.s3.eu-central-1.amazonaws.com/avatar.png' })
    avatar: string;

    @Column({ default: 'https://casting-secret.s3.eu-central-1.amazonaws.com/banner.jpg' })
    cover: string;

    @Column()
    name: string;

    @Column({ default: 'no data provided' })
    about: string;

    @Column({ default: 'no data provided' })
    headquarter: string;

    @Column({ default: false })
    is_address_public: boolean;

    @Column({ default: 'no data provided' })
    website: string;

    @Column({ default: 'no data provided' })
    since: string;

    @Column({ default: 1 })
    size_from: number | null;

    @Column({ default: 100 })
    size_to: number;

    @Column({ unique: true })
    slug: string;

    @ManyToOne(type => Profile, p => p.companies, { onDelete: 'CASCADE' })
    profile: Profile;

    @ManyToMany(type => TalentCategories, { onDelete: 'CASCADE' })
    @JoinTable()
    tags: TalentCategories[];

    // @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.companys,{  nullable:false, })
    // @JoinColumn({ name:'profile_id'})
    // profile:users_profile | null;

    // @OneToMany(()=>activity, (activity: activity)=>activity.company)
    // activitys:activity[];

    // @OneToMany(()=>company_tags, (company_tags: company_tags)=>company_tags.company)
    // companyTagss:company_tags[];

    // @OneToMany(()=>jobs, (jobs: jobs)=>jobs.profile)
    // jobss:jobs[];

}
