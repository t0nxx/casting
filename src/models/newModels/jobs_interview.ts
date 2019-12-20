import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Profile } from './users_profile';
import { Jobs } from './jobs';

@Entity('job_interview')
export class JobInterview {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: 'interview_date is required' })
    @Column()
    interview_date: Date;

    @IsNotEmpty({ message: 'interviewer is required' })
    @Column()
    interviewer: string;

    @IsNotEmpty({ message: 'location is required' })
    @Column()
    location: string;

    @ManyToOne(type => Profile, p => p.interview_jobs, { onDelete: 'CASCADE' })
    profile: Profile;

    @ManyToOne(type => Jobs, j => j.interviews, { onDelete: 'CASCADE' })
    job: Jobs;

}
