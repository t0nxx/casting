import { company_tags } from "./company_tags";
import { job_category } from "./job_category";
import { users_profile_categories } from "./users_profile_categories";
export declare class talent_categories {
    id: number;
    name_en: string;
    name_ar: string;
    companyTagss: company_tags[];
    jobCategorys: job_category[];
    usersProfileCategoriess: users_profile_categories[];
}
