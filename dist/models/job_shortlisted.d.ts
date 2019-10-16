import { jobs } from "./jobs";
import { users_profile } from "./users_profile";
export declare class job_shortlisted {
    id: number;
    shortlisted_date: Date;
    job: jobs | null;
    profile: users_profile | null;
}
