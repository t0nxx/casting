import { socialaccount_socialapp_sites } from "./socialaccount_socialapp_sites";
import { socialaccount_socialtoken } from "./socialaccount_socialtoken";
export declare class socialaccount_socialapp {
    id: number;
    provider: string;
    name: string;
    client_id: string;
    secret: string;
    key: string;
    socialaccountSocialappSitess: socialaccount_socialapp_sites[];
    socialaccountSocialtokens: socialaccount_socialtoken[];
}
