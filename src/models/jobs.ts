import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, OneToMany } from 'typeorm';
import { Company } from './company';
import { TalentCategories } from './talent_categories';
import { Profile } from './users_profile';
import { JobInterview } from './jobs_interview';
import { JobShortlist } from './jobs_shortlisted';
import { JobApplicants } from './jobs_applicants';

@Entity('jobs')
export class Jobs {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    publish_date: Date;

    @Column({ default: null, nullable: true })
    end_date: Date;

    @Column()
    title: string;

    @Column('longtext')
    description: string;

    @Column({ default: false })
    have_daily_perks: boolean;

    @Column({ default: 0 })
    daily_perks_budget: number;

    @Column({ default: false })
    have_transportation: boolean;

    @Column({ default: 0 })
    transportation_budget: number;

    @Column({ default: false })
    have_meal: boolean;

    @Column({ default: 0 })
    meal_budget: number;

    @Column({ default: false })
    have_space_rest: boolean;

    @Column({ default: 0 })
    space_rest_budget: number;

    @Column({ default: true })
    is_male: boolean;

    @Column({ default: true })
    is_female: boolean;

    @Column({ default: null })
    age: string;

    @Column({ default: false })
    hide_company: boolean;

    @Column({ default: null })
    latitude: string;

    @Column({ default: null })
    longitude: string;

    @Column({ unique: true })
    slug: string;

    @ManyToOne(type => Company, { eager: true, onDelete: 'CASCADE' })
    company: Company;

    @ManyToMany(type => TalentCategories, { onDelete: 'CASCADE' })
    @JoinTable()
    category: TalentCategories[];

    @Column('longtext')
    location: string;

    @OneToMany(type => JobInterview, jI => jI.job, { onDelete: 'CASCADE' })
    interviews: JobInterview[];

    @OneToMany(type => JobShortlist, jI => jI.job, { onDelete: 'CASCADE' })
    shortlisted: JobShortlist[];

    @OneToMany(type => JobApplicants, jI => jI.job, { onDelete: 'CASCADE' })
    applicants: JobApplicants[];

}
