import { jobs } from "./jobs";
import { users_profile } from "./users_profile";
export declare class job_applicants {
    id: number;
    applied_date: Date;
    job: jobs | null;
    profile: users_profile | null;
}
