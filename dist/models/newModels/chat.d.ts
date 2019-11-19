import { Profile } from './users_profile';
export declare class Chat {
    id: number;
    created: Date;
    sender: Profile;
    room: string;
    message: string;
    readRecipient: boolean;
}
