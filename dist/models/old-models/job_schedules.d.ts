import { jobs } from "./jobs";
import { users_profile } from "./users_profile";
export declare class job_schedules {
    id: number;
    created_date: Date;
    interview_date: Date;
    interviewer: string;
    location: string;
    job: jobs | null;
    profile: users_profile | null;
}
