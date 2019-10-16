import { users_profile } from "./users_profile";
import { activity } from "./activity";
import { company_tags } from "./company_tags";
import { jobs } from "./jobs";
export declare class company {
    id: number;
    avatar: string | null;
    cover: string | null;
    name: string;
    about: string | null;
    headquarter: string | null;
    is_address_public: boolean;
    website: string | null;
    since: string | null;
    size_from: number | null;
    size_to: number | null;
    slug: string;
    profile: users_profile | null;
    activitys: activity[];
    companyTagss: company_tags[];
    jobss: jobs[];
}
