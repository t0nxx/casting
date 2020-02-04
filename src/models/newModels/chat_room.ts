import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, Index, CreateDateColumn } from 'typeorm';
import { Profile } from './users_profile';
import { Chat } from './chat';
@Entity('chat_room')

export class ChatRoom {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;


    @CreateDateColumn()
    created: Date;

    // here to select all messages after user clear it/delete .
    @Column()
    last_deleted_from_participant1: Date;

    @Column()
    last_deleted_from_participant2: Date;

    @Column('simple-array', { nullable: true })
    muted_from: string[];

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    participant1: Profile;

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    participant2: Profile;

    @OneToMany(type => Chat, ch => ch.room)
    messages: Chat[];

}
