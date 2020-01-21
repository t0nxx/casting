import { Entity, ManyToOne, CreateDateColumn, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Profile } from './users_profile';

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

    @Index()
    @Column()
    room: string;

    @Column('text')
    message: string;

    @Column({ default: false })
    readRecipient: boolean;
}
