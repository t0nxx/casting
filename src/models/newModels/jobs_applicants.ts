import { Entity, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './users_profile';
import { Jobs } from './jobs';

@Entity('job_applicants')
export class JobApplicants {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Profile, p => p.applied_jobs)
    profile: Profile;

    @ManyToOne(type => Jobs, j => j.applicants)
    job: Jobs;

}
