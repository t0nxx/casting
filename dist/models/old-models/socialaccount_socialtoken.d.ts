import { socialaccount_socialaccount } from "./socialaccount_socialaccount";
import { socialaccount_socialapp } from "./socialaccount_socialapp";
export declare class socialaccount_socialtoken {
    id: number;
    token: string;
    token_secret: string;
    expires_at: Date | null;
    account: socialaccount_socialaccount | null;
    app: socialaccount_socialapp | null;
}
