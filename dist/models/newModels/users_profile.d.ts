import { User } from './auth_user';
import { ProfileSettings } from './profile_settings';
export declare class Profile {
    id: number;
    avatar: string;
    cover: string;
    gender: string;
    location: string;
    about: string;
    phone: string;
    slug: string;
    age_from: number;
    age_to: number;
    user: User;
    settings: ProfileSettings;
}
