import { Entity, ManyToOne, CreateDateColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './auth_user';
import { Profile } from './users_profile';

@Entity('friendship_friend')
export class FriendshipFriend {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created: Date;

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    fromUser: Profile;

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    toUser: Profile;

    @Column()
    room: string;

}
