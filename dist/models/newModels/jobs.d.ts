import { Company } from './company';
import { TalentCategories } from './talent_categories';
export declare class Jobs {
    id: number;
    publish_date: Date;
    title: string;
    description: string;
    have_daily_perks: boolean;
    daily_perks_budget: number;
    have_transportation: boolean;
    transportation_budget: number;
    have_meal: boolean;
    meal_budget: number;
    have_space_rest: boolean;
    space_rest_budget: number;
    is_male: boolean;
    is_female: boolean;
    age: string;
    hide_company: boolean;
    latitude: string;
    longitude: string;
    slug: string;
    company: Company;
    category: TalentCategories[];
}
