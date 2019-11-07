import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable,CreateDateColumn } from 'typeorm';
import { Company } from './company';
import { TalentCategories } from './talent_categories';

@Entity('jobs')
export class Jobs {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    publish_date: Date;

    @Column()
    title: string;

    @Column()
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

    @ManyToOne(type => Company, { eager: true })
    company: Company;

    @ManyToMany(type => TalentCategories, { onDelete: 'CASCADE' })
    @JoinTable()
    category: TalentCategories[];

    // @OneToMany(() => job_applicants, (job_applicants: job_applicants) => job_applicants.job)
    // jobApplicantss: job_applicants[];

    // @OneToMany(() => job_schedules, (job_schedules: job_schedules) => job_schedules.job)
    // jobScheduless: job_schedules[];

    // @OneToMany(() => job_shortlisted, (job_shortlisted: job_shortlisted) => job_shortlisted.job)
    // jobShortlisteds: job_shortlisted[];

}
