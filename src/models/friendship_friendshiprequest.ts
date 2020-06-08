import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from './auth_user';
import { Profile } from './users_profile';

@Entity('friendship_friendshiprequest')
export class FriendshipFriendshipRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    message: string;

    @CreateDateColumn()
    created: Date;

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    fromUser: Profile;

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    toUser: Profile;
}
