import { Entity, ManyToOne, CreateDateColumn, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './users_profile';
import { ChatRoom } from './chat_room';

@Entity('chat')
export class Chat {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created: Date;

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    sender: Profile;

    @ManyToOne(type => Profile, { onDelete: 'CASCADE' })
    recipient: Profile;

    // @Index()
    // @Column()
    // room: string;

    @ManyToOne(type => ChatRoom, room => room.messages, { onDelete: 'CASCADE' })
    room: ChatRoom;

    @Column('text')
    message: string;

    @Column({ default: false })
    readRecipient: boolean;
}
