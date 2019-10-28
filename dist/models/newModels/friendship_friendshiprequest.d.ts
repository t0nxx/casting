import { Profile } from './users_profile';
export declare class FriendshipFriendshipRequest {
    id: number;
    message: string;
    created: Date;
    fromUser: Profile;
    toUser: Profile;
}
