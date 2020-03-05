import { Profile } from './users_profile';
import { Chat } from './chat';
export declare class ChatRoom {
    id: number;
    name: string;
    created: Date;
    last_deleted_from_participant1: Date;
    last_deleted_from_participant2: Date;
    muted_from: string[];
    participant1: Profile;
    participant2: Profile;
    messages: Chat[];
}
