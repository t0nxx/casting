import { auth_user } from "./auth_user";
import { socialaccount_socialtoken } from "./socialaccount_socialtoken";
export declare class socialaccount_socialaccount {
    id: number;
    provider: string;
    uid: string;
    last_login: Date;
    date_joined: Date;
    extra_data: string;
    user: auth_user | null;
    socialaccountSocialtokens: socialaccount_socialtoken[];
}
