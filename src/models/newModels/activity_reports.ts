import { Entity, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Profile } from './users_profile';
import { Jobs } from './jobs';
import { Activity } from './activity';

@Entity('activity_reports')
export class ActivityReports {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reason: string;

    @ManyToOne(type => Profile, p => p.activity_reports)
    profile: Profile;

    @ManyToOne(type => Activity, a => a.reports)
    activity: Activity;


}
