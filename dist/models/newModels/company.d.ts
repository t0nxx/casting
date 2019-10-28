import { Profile } from './users_profile';
import { TalentCategories } from './talent_categories';
export declare class Company {
    id: number;
    avatar: string;
    cover: string;
    name: string;
    about: string;
    headquarter: string;
    is_address_public: boolean;
    website: string;
    since: string;
    size_from: number | null;
    size_to: number;
    slug: string;
    profile: Profile;
    tags: TalentCategories[];
}
