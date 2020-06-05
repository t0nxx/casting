import { AccountEmailaddresss } from './account_emailaddress';
import { Profile } from './users_profile';
export declare class User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password1: string;
    password2: string;
    about: string;
    resetPassCode: string;
    activationCode: string;
    isAdmin: boolean;
    is_active: boolean;
    social_site: string;
    social_site_id: string;
    date_joined: Date;
    accountEmailaddresss: AccountEmailaddresss[];
    profiles: Profile[];
}
