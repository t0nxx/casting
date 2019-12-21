import { Profile } from './users_profile';
import { Jobs } from './jobs';
export declare class JobInterview {
    id: number;
    interview_date: Date;
    interviewer: string;
    location: string;
    profile: Profile;
    job: Jobs;
}
