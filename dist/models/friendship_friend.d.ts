import { Profile } from './users_profile';
export declare class FriendshipFriend {
    id: number;
    created: Date;
    fromUser: Profile;
    toUser: Profile;
    room: string;
}
