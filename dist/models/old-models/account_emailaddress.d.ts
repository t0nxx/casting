import { auth_user } from "./auth_user";
import { account_emailconfirmation } from "./account_emailconfirmation";
export declare class account_emailaddress {
    id: number;
    email: string;
    verified: boolean;
    primary: boolean;
    user: auth_user | null;
    accountEmailconfirmations: account_emailconfirmation[];
}
