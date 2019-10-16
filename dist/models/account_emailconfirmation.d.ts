import { account_emailaddress } from "./account_emailaddress";
export declare class account_emailconfirmation {
    id: number;
    created: Date;
    sent: Date | null;
    key: string;
    emailAddress: account_emailaddress | null;
}
