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
    isAdmin: boolean;
    is_active: boolean;
    date_joined: Date;
    accountEmailaddresss: AccountEmailaddresss[];
    profiles: Profile[];
}
