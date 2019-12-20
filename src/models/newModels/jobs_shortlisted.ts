import { Entity, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './users_profile';
import { Jobs } from './jobs';

@Entity('job_shortlist')
export class JobShortlist {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Profile, p => p.shortlisted_jobs, { onDelete: 'CASCADE' })
    profile: Profile;

    @ManyToOne(type => Jobs, j => j.shortlisted, { onDelete: 'CASCADE' })
    job: Jobs;

}
