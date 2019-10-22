import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from './auth_user';
import { Profile } from './users_profile';

@Entity('friendship_friendshiprequest')
export class FriendshipFriendshipRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @CreateDateColumn()
    created: Date;

    // @Column("timestamp with time zone", {
    //     nullable: true,
    //     name: "rejected"
    // })
    // rejected: Date | null;

    // @Column("timestamp with time zone", {
    //     nullable: true,
    //     name: "viewed"
    // })
    // viewed: Date | null;

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    fromUser: Profile;

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    toUser: Profile;
}
